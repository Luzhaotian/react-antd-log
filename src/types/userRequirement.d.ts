/**
 * 用户需求相关类型
 */

/** 单月还款明细 */
export interface MonthlyPaymentItem {
  /** 期数（第几期） */
  period: number
  /** 月供总额 */
  monthlyPayment: number
  /** 当月偿还本金 */
  principal: number
  /** 当月偿还利息 */
  interest: number
  /** 剩余本金 */
  remainingPrincipal: number
}

/** 房贷计算记录（一条计算方案） */
export interface MortgageRecord {
  /** 唯一标识 */
  id: string
  /** 创建时间 */
  createdAt: number
  /** 更新时间 */
  updatedAt: number
  /** 名称/备注 */
  name: string
  /** 贷款类型：商贷 / 公积金贷款 */
  loanType: 'commercial' | 'provident'
  /** 城市/地区（用于获取利率，必填） */
  city: string
  /** 平米数（建筑面积，㎡） */
  areaSquareMeters: number
  /** 每平米价格（元/㎡） */
  pricePerSquareMeter: number
  /** 首付（元） */
  downPayment: number
  /** 贷款金额（元） */
  totalAmount: number
  /** 年利率（如 4.2 表示 4.2%） */
  annualRate: number
  /** 贷款期限（月） */
  termMonths: number
  /** 还款方式：等额本息 / 等额本金 */
  repayType: 'equal-payment' | 'equal-principal'
  /** 每月还款明细（根据表单计算得出） */
  monthlyPayments: MonthlyPaymentItem[]
}

/** 房贷计算表单值（用于抽屉内表单） */
export interface MortgageFormValues {
  name: string
  loanType: 'commercial' | 'provident'
  /** 省/市/区：Cascader 为 string[]，存储为 string（用 / 拼接） */
  city: string | string[]
  /** 平米数（㎡） */
  areaSquareMeters: number
  /** 每平米价格（元/㎡） */
  pricePerSquareMeter: number
  /** 首付（元） */
  downPayment: number
  /** 贷款金额（元） */
  totalAmount: number
  annualRate: number
  termMonths: number
  repayType: 'equal-payment' | 'equal-principal'
}

/** 房贷计算抽屉模式 */
export type MortgageDrawerMode = 'add' | 'edit' | 'view'

/** 房贷计算表格操作 handlers */
export interface MortgageTableHandlers {
  /** 查看 */
  onView: (record: MortgageRecord) => void
  /** 编辑 */
  onEdit: (record: MortgageRecord) => void
  /** 删除 */
  onDelete: (record: MortgageRecord) => void
}

/** 房贷计算抽屉 props */
export interface MortgageCalculatorDrawerProps {
  /** 是否打开 */
  open: boolean
  /** 模式 */
  mode: MortgageDrawerMode
  /** 记录 */
  record: MortgageRecord | null
  /** 关闭 */
  onClose: () => void
  /** 保存 */
  onSave: (record: MortgageRecord) => void
}

/** 导出用的计算参数（已转为展示文案） */
export interface MortgageExportParams {
  name: string
  loanTypeLabel: string
  city: string
  /** 平米数（㎡） */
  areaSquareMeters: number
  /** 每平米价格（元/㎡） */
  pricePerSquareMeter: number
  /** 首付（元） */
  downPayment: number
  /** 贷款金额（元） */
  loanAmount: number
  /** 总金额（元）= 首付 + 贷款金额 + 总利息 */
  totalAmount: number
  annualRate: number
  termMonths: number
  repayTypeLabel: string
}

/** 导出所需数据 */
export interface MortgageExportData {
  params: MortgageExportParams
  monthlyList: MonthlyPaymentItem[]
}
