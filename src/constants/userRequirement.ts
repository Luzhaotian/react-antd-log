import type { MortgageRecord } from '@/types'
/**
 * 用户需求相关常量
 */
/** 商贷默认年利率（%）- 无法获取实时利率时使用 */
export const DEFAULT_RATE_COMMERCIAL = 3.05
/** 公积金贷款默认年利率（%）- 无法获取实时利率时使用 */
export const DEFAULT_RATE_PROVIDENT = 2.6

/** 还款方式标签 */
export const REPAY_TYPE_LABEL: Record<MortgageRecord['repayType'], string> = {
  'equal-payment': '等额本息',
  'equal-principal': '等额本金',
}

/** 贷款类型标签 */
export const LOAN_TYPE_LABEL: Record<MortgageRecord['loanType'], string> = {
  commercial: '商贷',
  provident: '公积金贷款',
}

/** 还款方式选项 */
export const REPAY_OPTIONS = [
  { value: 'equal-payment' as const, label: REPAY_TYPE_LABEL['equal-payment'] },
  { value: 'equal-principal' as const, label: REPAY_TYPE_LABEL['equal-principal'] },
]

/** 贷款类型选项 */
export const LOAN_TYPE_OPTIONS = [
  { value: 'commercial' as const, label: LOAN_TYPE_LABEL['commercial'] },
  { value: 'provident' as const, label: LOAN_TYPE_LABEL['provident'] },
]

/** 用于 PDF 的中文字体（来自 jspdf-font 宋体），jsPDF 注册名 */
export const PDF_FONT_NAME = 'SongtiSCBlack'
export const FONT_FILE_NAME = 'SongtiSCBlack-normal.ttf'
