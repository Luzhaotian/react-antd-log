/**
 * API 相关常量配置
 * 使用 Vite 代理解决跨域问题
 * 开发环境使用代理，生产环境需要配置后端代理
 */

/** 基金 API（东方财富） */
export const FUND_API_URL: string = '/fundapi'

/** 实时估值 API（天天基金） */
export const FUND_REALTIME_URL: string = '/fundgz'

/** 基金搜索联想 API */
export const FUND_SUGGEST_URL: string = '/fundsuggest'

/** 基金详情数据 API（包含分时估值走势 Data_gzTrend） */
export const FUND_DATA_URL: string = '/funddata'

/** 东方财富数据中心 API（LPR 等） */
export const DATA_CENTER_URL: string = '/datacenter'

/** 通用请求参数（Wap 平台） */
export const COMMON_WAP_PARAMS = {
  /** 设备 ID */
  deviceid: 'Wap',
  /** 平台 */
  plat: 'Wap',
  /** 产品 */
  product: 'EFund',
  /** 版本 */
  version: '2.0.0',
  /** 用户 ID */
  Uid: '',
  /** 时间戳 */
} as const
