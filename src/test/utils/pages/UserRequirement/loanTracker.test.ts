import { describe, expect, it } from 'vitest'
import {
  calcAmortizationSchedule,
  formatMoney,
  getNextRepayment,
  getRepaymentProgress,
  isSameLoanTracker,
  normalizeLoanTracker,
  updateRepaymentPaid,
} from '@/utils/pages/UserRequirement/loanTracker'
import type { LoanTrackerRecord } from '@/types'

describe('loanTracker 纯函数', () => {
  it('calcAmortizationSchedule 生成等额本息计划', () => {
    const list = calcAmortizationSchedule(100000, 3.6, 12, '2026-01-01', 15)
    expect(list).toHaveLength(12)
    expect(list[0]!.period).toBe(1)
    expect(list[0]!.paid).toBe(false)
    expect(list[0]!.monthlyPayment).toBeGreaterThan(0)
    // 最后一期剩余本金应接近 0
    expect(list[11]!.remainingPrincipal).toBeLessThan(1)
    // 每期本息之和约等于月供
    const first = list[0]!
    expect(first.principal + first.interest).toBeCloseTo(first.monthlyPayment, 1)
  })

  it('利率或期数无效时返回空', () => {
    expect(calcAmortizationSchedule(100000, 0, 12, '2026-01-01', 1)).toEqual([])
    expect(calcAmortizationSchedule(100000, 3.6, 0, '2026-01-01', 1)).toEqual([])
  })

  it('normalizeLoanTracker 补齐缺省字段', () => {
    const raw = {
      id: '1',
      repayments: [{ period: 1, principal: 1, interest: 1 } as never],
    } as unknown as LoanTrackerRecord
    const n = normalizeLoanTracker(raw)
    expect(n.repayments[0]).toMatchObject({ paid: false, paidAmount: 0, paidDate: '' })
  })

  it('isSameLoanTracker 按关键字段比较', () => {
    const base = {
      loanAmount: 10,
      termMonths: 12,
      annualRate: 3,
      startDate: '2026-01-01',
      repaymentDay: 1,
    }
    expect(
      isSameLoanTracker(base as LoanTrackerRecord, { ...base } as LoanTrackerRecord)
    ).toBe(true)
    expect(
      isSameLoanTracker(base as LoanTrackerRecord, {
        ...base,
        annualRate: 4,
      } as LoanTrackerRecord)
    ).toBe(false)
  })

  it('updateRepaymentPaid / getNextRepayment / getRepaymentProgress', () => {
    const repayments = calcAmortizationSchedule(50000, 4.5, 6, '2026-01-01', 10)
    let record = {
      id: 't1',
      loanAmount: 50000,
      termMonths: 6,
      annualRate: 4.5,
      startDate: '2026-01-01',
      repaymentDay: 10,
      repayments,
    } as LoanTrackerRecord

    expect(getNextRepayment(record)?.period).toBe(1)

    record = updateRepaymentPaid(record, 1, true, '2026-01-10')
    expect(record.repayments[0]!.paid).toBe(true)
    expect(getNextRepayment(record)?.period).toBe(2)

    const progress = getRepaymentProgress(record)
    expect(progress.paidPeriods).toBe(1)
    expect(progress.unpaidPeriods).toBe(5)
    expect(progress.progressPercent).toBeCloseTo(16.67, 1)
  })

  it('formatMoney 保留两位小数', () => {
    expect(formatMoney(12)).toMatch(/12\.00/)
    expect(formatMoney(1234.5)).toMatch(/1,?234\.50/)
  })
})
