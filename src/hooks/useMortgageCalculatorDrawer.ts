import { useState, useCallback, useMemo, useEffect } from 'react'
import { Form, message } from 'antd'
import type {
  MonthlyPaymentItem,
  MortgageCalculatorDrawerProps,
  MortgageExportData,
  MortgageFormValues,
} from '@/types'
import { fetchMortgageRate } from '@/api/mortgage'
import { DEFAULT_RATE_COMMERCIAL, DEFAULT_RATE_PROVIDENT } from '@/constants'
import {
  regionPathToString,
  stringToRegionPath,
  exportMortgageToXLSX,
  exportMortgageToPDF,
  calcMonthlyPayments,
  createMortgageRecord,
  updateMortgageRecord,
} from '@/utils'

export function useMortgageCalculatorDrawer({
  open,
  mode,
  record,
  onClose,
  onSave,
}: MortgageCalculatorDrawerProps) {
  const [form] = Form.useForm<MortgageFormValues>()
  const [monthlyList, setMonthlyList] = useState<MonthlyPaymentItem[]>([])
  const [rateLoading, setRateLoading] = useState(false)
  const [pdfExportLoading, setPdfExportLoading] = useState(false)
  const [pageSize, setPageSize] = useState(12)
  const [currentPage, setCurrentPage] = useState(1)

  const isView = mode === 'view'
  const isAdd = mode === 'add'

  const initialValues: MortgageFormValues = useMemo(
    () =>
      record
        ? {
            name: record.name,
            loanType: record.loanType ?? 'commercial',
            city: record.city ?? '其他',
            areaSquareMeters: record.areaSquareMeters ?? 0,
            pricePerSquareMeter: record.pricePerSquareMeter ?? 0,
            downPayment: record.downPayment ?? 0,
            totalAmount: record.totalAmount,
            annualRate: record.annualRate,
            termMonths: record.termMonths,
            repayType: record.repayType,
          }
        : {
            name: '',
            loanType: 'commercial',
            city: '',
            areaSquareMeters: 0,
            pricePerSquareMeter: 0,
            downPayment: 0,
            totalAmount: 0,
            annualRate: DEFAULT_RATE_COMMERCIAL,
            termMonths: 360,
            repayType: 'equal-payment',
          },
    [record]
  )

  useEffect(() => {
    if (open) {
      const cityValue = Array.isArray(initialValues.city)
        ? initialValues.city
        : stringToRegionPath(initialValues.city)
      form.setFieldsValue({
        ...initialValues,
        city: cityValue,
      })
      if (record?.monthlyPayments?.length) {
        setMonthlyList(record.monthlyPayments)
        setCurrentPage(1)
      } else {
        setMonthlyList([])
        setCurrentPage(1)
      }
    }
  }, [open, form, initialValues, record?.monthlyPayments?.length])

  const recalcFromForm = useCallback(() => {
    const values = form.getFieldsValue()
    const { totalAmount, annualRate, termMonths, repayType } = values
    if (totalAmount > 0 && termMonths > 0) {
      setMonthlyList(calcMonthlyPayments(totalAmount, annualRate, termMonths, repayType))
      setCurrentPage(1)
    } else {
      setMonthlyList([])
      setCurrentPage(1)
    }
  }, [form])

  const handleLoanTypeChange = useCallback(
    (loanType: 'commercial' | 'provident') => {
      const defaultRate =
        loanType === 'commercial' ? DEFAULT_RATE_COMMERCIAL : DEFAULT_RATE_PROVIDENT
      form.setFieldValue('annualRate', defaultRate)
    },
    [form]
  )

  const handleFetchRate = useCallback(async () => {
    const { city, loanType } = form.getFieldsValue()
    const cityStr = regionPathToString(city)
    if (!cityStr || cityStr.trim() === '') {
      message.warning('请先选择地区后再获取最新利率')
      return
    }
    setRateLoading(true)
    try {
      const rate = await fetchMortgageRate(cityStr, loanType)
      if (rate != null) {
        form.setFieldValue('annualRate', rate)
        message.success('已获取最新利率：' + rate + '%')
      } else {
        const defaultRate =
          loanType === 'commercial' ? DEFAULT_RATE_COMMERCIAL : DEFAULT_RATE_PROVIDENT
        form.setFieldValue('annualRate', defaultRate)
        message.info('暂未获取到实时利率，已使用默认（可手动修改）')
      }
    } catch {
      const loanTypeVal = form.getFieldValue('loanType')
      const defaultRate =
        loanTypeVal === 'commercial' ? DEFAULT_RATE_COMMERCIAL : DEFAULT_RATE_PROVIDENT
      form.setFieldValue('annualRate', defaultRate)
      message.info('获取利率失败，已使用默认（可手动修改）')
    } finally {
      setRateLoading(false)
    }
  }, [form])

  const handleOk = useCallback(() => {
    form.validateFields().then(values => {
      const payload = {
        ...values,
        city: regionPathToString(values.city),
      }
      if (isAdd) {
        const newRecord = createMortgageRecord(payload)
        onSave(newRecord)
      } else if (record) {
        const updated = updateMortgageRecord(record, payload)
        onSave(updated)
      }
      onClose()
    })
  }, [form, isAdd, record, onSave, onClose])

  const buildExportData = useCallback((): MortgageExportData => {
    const values = form.getFieldsValue()
    const cityStr = regionPathToString(values.city)
    const loanTypeLabel = values.loanType === 'provident' ? '公积金贷款' : '商贷'
    const repayLabel = values.repayType === 'equal-principal' ? '等额本金' : '等额本息'
    const downPayment = values.downPayment ?? 0
    const loanAmount = values.totalAmount ?? 0
    const totalInterest = monthlyList.reduce((s, m) => s + m.interest, 0)
    return {
      params: {
        name: values.name ?? '',
        loanTypeLabel,
        city: cityStr,
        areaSquareMeters: values.areaSquareMeters ?? 0,
        pricePerSquareMeter: values.pricePerSquareMeter ?? 0,
        downPayment,
        loanAmount,
        totalAmount: downPayment + loanAmount + totalInterest,
        annualRate: values.annualRate ?? 0,
        termMonths: values.termMonths ?? 0,
        repayTypeLabel: repayLabel,
      },
      monthlyList,
    }
  }, [form, monthlyList])

  const handleExportXLSX = useCallback(() => {
    exportMortgageToXLSX(buildExportData())
    message.success('已导出 XLSX')
  }, [buildExportData])

  const handleExportPDF = useCallback(async () => {
    setPdfExportLoading(true)
    try {
      await exportMortgageToPDF(buildExportData())
      message.success('已导出 PDF')
    } catch (e) {
      message.error(e instanceof Error ? e.message : '导出 PDF 失败')
    } finally {
      setPdfExportLoading(false)
    }
  }, [buildExportData])

  return {
    form,
    initialValues,
    monthlyList,
    rateLoading,
    pdfExportLoading,
    pageSize,
    currentPage,
    setPageSize,
    setCurrentPage,
    isView,
    recalcFromForm,
    handleLoanTypeChange,
    handleFetchRate,
    handleOk,
    handleExportXLSX,
    handleExportPDF,
  }
}
