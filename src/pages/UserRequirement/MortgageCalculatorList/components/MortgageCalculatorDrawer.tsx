import { useCallback } from 'react'
import { Button, Space } from 'antd'
import { FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons'
import AppDrawer from '@/components/AppDrawer'
import type { MortgageCalculatorDrawerProps } from '@/types'
import { useMortgageCalculatorDrawer } from '../../../../hooks/useMortgageCalculatorDrawer'
import { MortgageCalculatorForm } from './MortgageCalculatorForm'
import { MonthlyPaymentTable } from './MonthlyPaymentTable'

export default function MortgageCalculatorDrawer(props: MortgageCalculatorDrawerProps) {
  const {
    form,
    initialValues,
    monthlyList,
    rateLoading,
    pageSize,
    currentPage,
    setPageSize,
    setCurrentPage,
    isView,
    pdfExportLoading,
    recalcFromForm,
    handleLoanTypeChange,
    handleFetchRate,
    handleOk,
    handleExportXLSX,
    handleExportPDF,
  } = useMortgageCalculatorDrawer(props)

  const handlePageChange = useCallback(
    (page: number, size?: number) => {
      setCurrentPage(page)
      if (size !== undefined) setPageSize(size)
    },
    [setCurrentPage, setPageSize]
  )

  const totalInterest = monthlyList.reduce((s, m) => s + m.interest, 0)

  const title =
    props.mode === 'add' ? '新增房贷计算' : props.mode === 'edit' ? '编辑房贷计算' : '查看房贷计算'

  return (
    <AppDrawer
      title={title}
      placement="right"
      width={920}
      open={props.open}
      onClose={props.onClose}
      footer={
        <Space className="w-full justify-end">
          {isView ? (
            <>
              <Button icon={<FileExcelOutlined />} onClick={handleExportXLSX}>
                导出 XLSX
              </Button>
              <Button
                icon={<FilePdfOutlined />}
                loading={pdfExportLoading}
                onClick={handleExportPDF}
              >
                导出 PDF
              </Button>
              <Button type="primary" onClick={props.onClose}>
                关闭
              </Button>
            </>
          ) : (
            <>
              <Button onClick={props.onClose}>取消</Button>
              <Button icon={<FileExcelOutlined />} onClick={handleExportXLSX}>
                导出 XLSX
              </Button>
              <Button
                icon={<FilePdfOutlined />}
                loading={pdfExportLoading}
                onClick={handleExportPDF}
              >
                导出 PDF
              </Button>
              <Button type="primary" onClick={handleOk}>
                保存
              </Button>
            </>
          )}
        </Space>
      }
    >
      <div className="flex flex-col gap-6">
        <div>
          <div className="mb-3 text-sm font-medium text-gray-600">计算参数</div>
          <MortgageCalculatorForm
            form={form}
            initialValues={initialValues}
            totalInterest={totalInterest}
            disabled={isView}
            rateLoading={rateLoading}
            onLoanTypeChange={handleLoanTypeChange}
            onFetchRate={handleFetchRate}
            onRecalc={recalcFromForm}
          />
        </div>

        <div>
          <div className="mb-3 text-sm font-medium text-gray-600">
            每月还款明细（共 {monthlyList.length} 期）
          </div>
          <MonthlyPaymentTable
            dataSource={monthlyList}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </AppDrawer>
  )
}
