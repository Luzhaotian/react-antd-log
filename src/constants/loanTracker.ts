/**
 * 房贷还款追踪相关常量
 */

/** 默认贷款参数（用户提供的数据） */
export const DEFAULT_LOAN_PARAMS = {
  name: '我的房贷',
  loanAmount: 570000,
  termMonths: 360,
  startDate: '2026-05-20',
  repaymentDay: 20,
  annualRate: 2.6,
  monthlyPayment: 2281.94,
  endDate: '2056-05-19',
} as const
