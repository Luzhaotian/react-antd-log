import { DEFAULT_LOAN_PARAMS } from '@/constants/loanTracker'
import { IDB_KEYS, STORAGE_KEYS } from '@/constants'
import type { LoanTrackerRecord, RepaymentStatus } from '@/types'
import { idbGet, idbSet, storage } from '@/utils'

/**
 * 生成唯一 id
 */
function nextId(): string {
  return `lt-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

/**
 * 将日期字符串解析为 Date 对象
 */
function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/**
 * 将 Date 对象格式化为 ISO date string (YYYY-MM-DD)
 */
function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * 获取某期应还日期
 * 逻辑：每月固定还款日，首期从发放日的下月开始
 * 发放日 2026-05-20，还款日 20 → 首期 2026-06-20，第二期 2026-07-20，以此类推
 */
function getDueDate(startDate: string, repaymentDay: number, period: number): string {
  const start = parseDate(startDate)
  const startYear = start.getFullYear()
  const startMonth = start.getMonth() // 0-based

  let targetMonth = startMonth + period
  let targetYear = startYear

  targetYear += Math.floor(targetMonth / 12)
  targetMonth = targetMonth % 12

  const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate()
  const targetDay = Math.min(repaymentDay, daysInMonth)

  return formatDate(new Date(targetYear, targetMonth, targetDay))
}

/**
 * 计算等额本息还款计划
 */
export function calcAmortizationSchedule(
  loanAmount: number,
  annualRate: number,
  termMonths: number,
  startDate: string,
  repaymentDay: number
): RepaymentStatus[] {
  const r = annualRate / 100 / 12 // 月利率
  if (r <= 0 || termMonths <= 0) return []

  const factor = Math.pow(1 + r, termMonths)
  const monthlyPayment = (loanAmount * (r * factor)) / (factor - 1)

  const list: RepaymentStatus[] = []
  let remaining = loanAmount

  for (let k = 1; k <= termMonths; k++) {
    const interest = remaining * r
    const principal = monthlyPayment - interest
    remaining = Math.max(0, remaining - principal)

    list.push({
      period: k,
      dueDate: getDueDate(startDate, repaymentDay, k),
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      principal: Math.round(principal * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      remainingPrincipal: Math.round(remaining * 100) / 100,
      paid: false,
      paidAmount: 0,
      paidDate: '',
    })
  }

  return list
}

/**
 * 创建默认的还款追踪记录
 */
export function createDefaultLoanTracker(): LoanTrackerRecord {
  const now = Date.now()
  const params = DEFAULT_LOAN_PARAMS
  const repayments = calcAmortizationSchedule(
    params.loanAmount,
    params.annualRate,
    params.termMonths,
    params.startDate,
    params.repaymentDay
  )

  return {
    id: nextId(),
    createdAt: now,
    updatedAt: now,
    name: params.name,
    loanAmount: params.loanAmount,
    termMonths: params.termMonths,
    startDate: params.startDate,
    repaymentDay: params.repaymentDay,
    annualRate: params.annualRate,
    monthlyPayment: params.monthlyPayment,
    repayType: 'equal-payment',
    endDate: params.endDate,
    repayments,
  }
}

/**
 * 规范化还款记录（兼容旧数据缺字段）
 */
export function normalizeLoanTracker(record: LoanTrackerRecord): LoanTrackerRecord {
  return {
    ...record,
    repayments: record.repayments.map(r => ({
      ...r,
      paid: Boolean(r.paid),
      paidAmount: r.paidAmount ?? 0,
      paidDate: r.paidDate ?? '',
    })),
  }
}

/** 判断是否为同一笔贷款（用于合并已还状态） */
export function isSameLoanTracker(a: LoanTrackerRecord, b: LoanTrackerRecord): boolean {
  return (
    a.loanAmount === b.loanAmount &&
    a.termMonths === b.termMonths &&
    a.annualRate === b.annualRate &&
    a.startDate === b.startDate &&
    a.repaymentDay === b.repaymentDay
  )
}

/**
 * 将已保存的「已还」状态合并到新的还款计划（避免从房贷页跳转时覆盖标记）
 */
export function mergeRepaymentPaidStatus(
  fresh: LoanTrackerRecord,
  saved: LoanTrackerRecord | null
): LoanTrackerRecord {
  if (!saved || !isSameLoanTracker(fresh, saved)) return fresh

  const paidByPeriod = new Map(
    saved.repayments.filter(r => r.paid).map(r => [r.period, r] as const)
  )
  if (paidByPeriod.size === 0) return fresh

  return {
    ...fresh,
    repayments: fresh.repayments.map(r => {
      const paid = paidByPeriod.get(r.period)
      if (!paid) return r
      return {
        ...r,
        paid: true,
        paidAmount: paid.paidAmount || r.monthlyPayment,
        paidDate: paid.paidDate || '',
      }
    }),
  }
}

/**
 * 标记单期已还 / 未还（返回新对象）
 */
export function updateRepaymentPaid(
  record: LoanTrackerRecord,
  period: number,
  paid: boolean,
  paidDate = ''
): LoanTrackerRecord {
  return {
    ...record,
    updatedAt: Date.now(),
    repayments: record.repayments.map(r => {
      if (r.period !== period) return r
      if (paid) {
        return {
          ...r,
          paid: true,
          paidAmount: r.monthlyPayment,
          paidDate: paidDate || formatDate(new Date()),
        }
      }
      return { ...r, paid: false, paidAmount: 0, paidDate: '' }
    }),
  }
}

/**
 * 从 IndexedDB 加载还款追踪记录（自动迁移旧版 localStorage）
 */
export async function loadLoanTracker(): Promise<LoanTrackerRecord | null> {
  const fromIdb = await idbGet<LoanTrackerRecord>(IDB_KEYS.LOAN_TRACKER)
  if (fromIdb) return normalizeLoanTracker(fromIdb)

  const legacy = storage.get<LoanTrackerRecord>(STORAGE_KEYS.LOAN_TRACKER)
  if (!legacy) return null

  const normalized = normalizeLoanTracker(legacy)
  await idbSet(IDB_KEYS.LOAN_TRACKER, normalized)
  storage.remove(STORAGE_KEYS.LOAN_TRACKER)
  return normalized
}

/**
 * 保存还款追踪记录到 IndexedDB
 */
export async function saveLoanTracker(record: LoanTrackerRecord): Promise<void> {
  const next = normalizeLoanTracker({ ...record, updatedAt: Date.now() })
  await idbSet(IDB_KEYS.LOAN_TRACKER, next)
}

/**
 * 获取下期还款信息
 */
export function getNextRepayment(record: LoanTrackerRecord): RepaymentStatus | null {
  return record.repayments.find(r => !r.paid) ?? null
}

/**
 * 获取还款进度统计
 */
export function getRepaymentProgress(record: LoanTrackerRecord) {
  const totalPeriods = record.repayments.length
  const paidPeriods = record.repayments.filter(r => r.paid).length
  const totalPrincipalPaid = record.repayments
    .filter(r => r.paid)
    .reduce((s, r) => s + r.principal, 0)
  const totalInterestPaid = record.repayments
    .filter(r => r.paid)
    .reduce((s, r) => s + r.interest, 0)
  const totalPaid = record.repayments.filter(r => r.paid).reduce((s, r) => s + r.paidAmount, 0)

  const nextRepayment = getNextRepayment(record)
  // 还原下期期初余额：remainingPrincipal 是还款后的余额，加回当期本金 = 期初余额
  const remainingPrincipal = nextRepayment
    ? nextRepayment.remainingPrincipal + nextRepayment.principal
    : 0

  const totalInterest = record.repayments.reduce((s, r) => s + r.interest, 0)

  return {
    totalPeriods,
    paidPeriods,
    unpaidPeriods: totalPeriods - paidPeriods,
    totalPrincipalPaid: Math.round(totalPrincipalPaid * 100) / 100,
    totalInterestPaid: Math.round(totalInterestPaid * 100) / 100,
    totalPaid: Math.round(totalPaid * 100) / 100,
    remainingPrincipal: Math.round(remainingPrincipal * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    progressPercent: Math.round((paidPeriods / totalPeriods) * 10000) / 100,
    nextRepayment,
  }
}

/**
 * 计算距离下期还款日的天数
 */
export function getDaysUntilDue(record: LoanTrackerRecord): number | null {
  const next = getNextRepayment(record)
  if (!next) return null

  const dueDate = parseDate(next.dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  dueDate.setHours(0, 0, 0, 0)

  return Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

/**
 * 提前还款模拟计算
 * @param record 贷款记录
 * @param payoffDate 提前还清日期（ISO date string）
 * @returns 节省的利息
 */
export function calcEarlyPayoff(
  record: LoanTrackerRecord,
  payoffDate: string
): { savedInterest: number; remainingPrincipalAtPayoff: number; payoffAmount: number } | null {
  const payoff = parseDate(payoffDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  payoff.setHours(0, 0, 0, 0)

  if (payoff <= today) return null

  // 找到提前还款日期所在的那一期
  let payoffPeriod = -1
  for (let i = 0; i < record.repayments.length; i++) {
    const due = parseDate(record.repayments[i].dueDate)
    if (due >= payoff) {
      payoffPeriod = i
      break
    }
  }

  if (payoffPeriod === -1) return null

  // 计算到提前还款日为止，按原计划总利息
  const totalInterestOriginal = record.repayments.reduce((s, r) => s + r.interest, 0)

  // 计算到提前还款日为止，实际已还利息 + 当期利息（按天数比例）
  const paidPeriods = record.repayments.slice(0, payoffPeriod)
  const paidInterest = paidPeriods.reduce((s, r) => s + r.interest, 0)

  // 当期利息按天数比例计算
  const currentPeriod = record.repayments[payoffPeriod]
  const prevDueDate =
    payoffPeriod > 0
      ? parseDate(record.repayments[payoffPeriod - 1].dueDate)
      : parseDate(record.startDate)
  const currentDueDate = parseDate(currentPeriod.dueDate)

  const totalDays = Math.ceil(
    (currentDueDate.getTime() - prevDueDate.getTime()) / (1000 * 60 * 60 * 24)
  )
  const elapsedDays = Math.ceil((payoff.getTime() - prevDueDate.getTime()) / (1000 * 60 * 60 * 24))
  const partialInterest = currentPeriod.interest * (elapsedDays / totalDays)

  const actualInterestBeforePayoff = paidInterest + partialInterest

  // 提前还款时剩余本金 = 当期期初剩余本金
  const remainingPrincipal =
    payoffPeriod > 0 ? record.repayments[payoffPeriod - 1].remainingPrincipal : record.loanAmount

  // 提前还款金额 = 剩余本金 + 当期已产生利息
  const payoffAmount = remainingPrincipal + partialInterest

  const savedInterest = totalInterestOriginal - actualInterestBeforePayoff

  return {
    savedInterest: Math.round(savedInterest * 100) / 100,
    remainingPrincipalAtPayoff: Math.round(remainingPrincipal * 100) / 100,
    payoffAmount: Math.round(payoffAmount * 100) / 100,
  }
}

/**
 * 根据提前还款金额计算还清日期
 * @param record 贷款记录
 * @param payoffAmount 提前还款金额（元）
 * @returns 还清日期和节省的利息
 */
export function calcPayoffDateFromAmount(
  record: LoanTrackerRecord,
  payoffAmount: number
): { payoffDate: string; savedInterest: number; remainingPrincipal: number } | null {
  if (payoffAmount <= 0) return null

  const totalInterestOriginal = record.repayments.reduce((s, r) => s + r.interest, 0)
  let remaining = record.loanAmount
  let paidInterest = 0

  for (let i = 0; i < record.repayments.length; i++) {
    const r = record.repayments[i]
    // 当期期初剩余本金
    const principalBefore = remaining
    // 如果还款金额 >= 当期期初剩余本金 + 当期利息，说明这期能还清
    const fullPayoffThisPeriod = principalBefore + r.interest

    if (payoffAmount >= fullPayoffThisPeriod) {
      // 这期能还清
      const savedInterest = totalInterestOriginal - paidInterest - r.interest
      return {
        payoffDate: r.dueDate,
        savedInterest: Math.round(savedInterest * 100) / 100,
        remainingPrincipal: 0,
      }
    }

    // 这期还不清，继续
    paidInterest += r.interest
    remaining = Math.max(0, remaining - r.principal)
  }

  return null
}

/**
 * 格式化金额（保留2位小数）
 */
export function formatMoney(value: number): string {
  return value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
