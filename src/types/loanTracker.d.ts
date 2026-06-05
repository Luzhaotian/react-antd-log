/**
 * 房贷还款追踪相关类型
 */

/** 单期还款状态 */
export interface RepaymentStatus {
  /** 期数（第几期，1-based） */
  period: number
  /** 应还日期（ISO date string，如 "2026-06-20"） */
  dueDate: string
  /** 月供金额（元） */
  monthlyPayment: number
  /** 当期本金（元） */
  principal: number
  /** 当期利息（元） */
  interest: number
  /** 还款后剩余本金（元） */
  remainingPrincipal: number
  /** 是否已还款 */
  paid: boolean
  /** 实还金额（元），未还则为 0 */
  paidAmount: number
  /** 实还日期（ISO date string），未还则为空 */
  paidDate: string
}

/** 房贷还款追踪记录 */
export interface LoanTrackerRecord {
  /** 唯一标识 */
  id: string
  /** 创建时间 */
  createdAt: number
  /** 更新时间 */
  updatedAt: number
  /** 贷款名称/备注 */
  name: string
  /** 贷款金额（元） */
  loanAmount: number
  /** 贷款期限（月） */
  termMonths: number
  /** 贷款发放日期（ISO date string） */
  startDate: string
  /** 约定还款日（每月几号） */
  repaymentDay: number
  /** 年利率（如 2.6 表示 2.6%） */
  annualRate: number
  /** 月还款额（元） */
  monthlyPayment: number
  /** 还款方式（固定为等额本息） */
  repayType: 'equal-payment'
  /** 约定到期日期（ISO date string） */
  endDate: string
  /** 还款状态列表 */
  repayments: RepaymentStatus[]
}
