import { idbGet, idbSet, idbDel } from '@/utils'
import type { MortgageRecord, MonthlyPaymentItem } from '@/types'
import { IDB_KEYS } from '@/constants'

/** 兼容旧数据：补全 loanType、city、downPayment、areaSquareMeters、pricePerSquareMeter */
function normalizeRecord(r: MortgageRecord): MortgageRecord {
  const hasAll =
    r.loanType != null &&
    r.city != null &&
    r.downPayment != null &&
    r.areaSquareMeters != null &&
    r.pricePerSquareMeter != null
  if (hasAll) return r
  return {
    ...r,
    loanType: r.loanType ?? 'commercial',
    city: r.city ?? '其他',
    downPayment: r.downPayment ?? 0,
    areaSquareMeters: r.areaSquareMeters ?? 0,
    pricePerSquareMeter: r.pricePerSquareMeter ?? 0,
  }
}

/**
 * 等额本息：计算每月还款明细
 */
function calcEqualPayment(
  totalAmount: number,
  annualRate: number,
  termMonths: number
): MonthlyPaymentItem[] {
  const r = annualRate / 100 / 12
  if (r <= 0 || termMonths <= 0) return []

  const factor = Math.pow(1 + r, termMonths)
  const monthlyPayment = (totalAmount * (r * factor)) / (factor - 1)

  const list: MonthlyPaymentItem[] = []
  let remaining = totalAmount

  for (let k = 1; k <= termMonths; k++) {
    const interest = remaining * r
    const principal = monthlyPayment - interest
    remaining = Math.max(0, remaining - principal)
    list.push({
      period: k,
      monthlyPayment,
      principal,
      interest,
      remainingPrincipal: remaining,
    })
  }
  return list
}

/**
 * 等额本金：计算每月还款明细
 */
function calcEqualPrincipal(
  totalAmount: number,
  annualRate: number,
  termMonths: number
): MonthlyPaymentItem[] {
  const r = annualRate / 100 / 12
  const principalPerMonth = totalAmount / termMonths

  const list: MonthlyPaymentItem[] = []
  let remaining = totalAmount

  for (let k = 1; k <= termMonths; k++) {
    const interest = remaining * r
    const monthlyPayment = principalPerMonth + interest
    remaining = Math.max(0, remaining - principalPerMonth)
    list.push({
      period: k,
      monthlyPayment,
      principal: principalPerMonth,
      interest,
      remainingPrincipal: remaining,
    })
  }
  return list
}

/**
 * 根据表单参数计算每月还款明细
 */
export function calcMonthlyPayments(
  totalAmount: number,
  annualRate: number,
  termMonths: number,
  repayType: 'equal-payment' | 'equal-principal'
): MonthlyPaymentItem[] {
  if (totalAmount <= 0 || termMonths <= 0) return []
  return repayType === 'equal-payment'
    ? calcEqualPayment(totalAmount, annualRate, termMonths)
    : calcEqualPrincipal(totalAmount, annualRate, termMonths)
}

/**
 * 生成唯一 id
 */
function nextId(): string {
  return `mc-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

/**
 * 从 IndexedDB 加载房贷计算列表
 */
export async function loadMortgageList(): Promise<MortgageRecord[]> {
  const raw = await idbGet<MortgageRecord[]>(IDB_KEYS.MORTGAGE_CALCULATOR_LIST)
  if (!Array.isArray(raw)) return []
  return raw.map(normalizeRecord)
}

/**
 * 保存房贷计算列表到 IndexedDB
 */
export async function saveMortgageList(list: MortgageRecord[]): Promise<void> {
  if (list.length === 0) {
    await idbDel(IDB_KEYS.MORTGAGE_CALCULATOR_LIST)
    return
  }
  await idbSet(IDB_KEYS.MORTGAGE_CALCULATOR_LIST, list)
}

/**
 * 创建一条新记录（用于新增）
 */
export function createMortgageRecord(values: {
  name: string
  loanType: 'commercial' | 'provident'
  city: string
  areaSquareMeters: number
  pricePerSquareMeter: number
  downPayment: number
  totalAmount: number
  annualRate: number
  termMonths: number
  repayType: 'equal-payment' | 'equal-principal'
}): MortgageRecord {
  const now = Date.now()
  const monthlyPayments = calcMonthlyPayments(
    values.totalAmount,
    values.annualRate,
    values.termMonths,
    values.repayType
  )
  return {
    id: nextId(),
    createdAt: now,
    updatedAt: now,
    name: values.name,
    loanType: values.loanType,
    city: values.city,
    areaSquareMeters: values.areaSquareMeters ?? 0,
    pricePerSquareMeter: values.pricePerSquareMeter ?? 0,
    downPayment: values.downPayment ?? 0,
    totalAmount: values.totalAmount,
    annualRate: values.annualRate,
    termMonths: values.termMonths,
    repayType: values.repayType,
    monthlyPayments,
  }
}

/**
 * 用表单值更新记录（用于编辑），返回更新后的记录
 */
export function updateMortgageRecord(
  record: MortgageRecord,
  values: {
    name: string
    loanType: 'commercial' | 'provident'
    city: string
    areaSquareMeters: number
    pricePerSquareMeter: number
    downPayment: number
    totalAmount: number
    annualRate: number
    termMonths: number
    repayType: 'equal-payment' | 'equal-principal'
  }
): MortgageRecord {
  const monthlyPayments = calcMonthlyPayments(
    values.totalAmount,
    values.annualRate,
    values.termMonths,
    values.repayType
  )
  return {
    ...record,
    updatedAt: Date.now(),
    name: values.name,
    loanType: values.loanType,
    city: values.city,
    areaSquareMeters: values.areaSquareMeters ?? 0,
    pricePerSquareMeter: values.pricePerSquareMeter ?? 0,
    downPayment: values.downPayment ?? 0,
    totalAmount: values.totalAmount,
    annualRate: values.annualRate,
    termMonths: values.termMonths,
    repayType: values.repayType,
    monthlyPayments,
  }
}
