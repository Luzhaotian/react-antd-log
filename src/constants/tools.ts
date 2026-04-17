import type { TemplateType, Option } from '@/types'

/**
 * fileRename 工具相关常量
 */
/** 文件重命名导出默认文件名 */
export const DEFAULT_EXPORT_FILENAME: string = '卢照天'

/** 模板值类型 */
export const TEMPLATE_VALUE_TYPE = {
  DATE_NUM: 'date-num',
  INVOICE_MONTH: 'invoice-month',
  RECEIPT_MONTH: 'receipt-month',
  CUSTOM: 'custom',
} as const

/** 模板标签类型 */
export const TEMPLATE_LABEL_TYPE = {
  DATE_NUM: '姓名-类型-日期_数值',
  INVOICE_MONTH: '姓名-Invoice-月份',
  RECEIPT_MONTH: '姓名-Receipt-月份',
  CUSTOM: '自定义',
} as const

/** 模板选项 */
export const TEMPLATE_OPTIONS: Option<TemplateType, string>[] = [
  { value: TEMPLATE_VALUE_TYPE.DATE_NUM, label: TEMPLATE_LABEL_TYPE.DATE_NUM },
  { value: TEMPLATE_VALUE_TYPE.INVOICE_MONTH, label: TEMPLATE_LABEL_TYPE.INVOICE_MONTH },
  { value: TEMPLATE_VALUE_TYPE.RECEIPT_MONTH, label: TEMPLATE_LABEL_TYPE.RECEIPT_MONTH },
  { value: TEMPLATE_VALUE_TYPE.CUSTOM, label: TEMPLATE_LABEL_TYPE.CUSTOM },
]

/** 日期数值类型 */
export const DATE_NUM_TYPE = {
  ALIPAY: '支付宝账单',
} as const

/** 日期数值类型选项 */
export const DATE_NUM_TYPE_OPTIONS: Option<string, string>[] = [
  { value: DATE_NUM_TYPE.ALIPAY, label: DATE_NUM_TYPE.ALIPAY },
]

/** 组件尺寸类型 */
export const COMPONENT_SIZE_TYPE = {
  SMALL: 'small',
  MIDDLE: 'middle',
  LARGE: 'large',
} as const

/**
 * jsonViewer 工具相关常量
 */
/** 存储 key 常量，统一管理所有 localStorage key */
export const STORAGE_KEYS = {
  FUND_CODES: 'fund_monitor_codes',
} as const

/**
 * codeCompress 工具相关常量
 */
export const TEXT_AREA_ROWS = 18

/** 代码压缩类型 */
export const COMPRESS_TYPE = {
  JSON: 'json',
  JS: 'javascript',
  CSS: 'css',
  HTML: 'html',
} as const
