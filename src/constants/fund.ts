import type { Option } from '@/types'
import type { TimeRange } from '@/types'

/** 时间范围类型常量 */
export const TIME_RANGE = {
  Y: 'y',
  THREE_Y: '3y',
  SIX_Y: '6y',
  ONE_N: 'n',
  THREE_N: '3n',
  FIVE_N: '5n',
} as const

/** 图表类型 */
export const CHART_TYPE = {
  VALUATION: 'valuation',
  YIELD: 'yield',
  NET_VALUE: 'netValue',
} as const

/** 默认监控的基金代码 */
export const DEFAULT_FUND_CODES: string[] = [
  /** 南方中证半导体产业指数发起C */
  '020840',
  /** 易方达黄金ETF */
  '159934',
  /** 招商中证白酒指数(LOF)A */
  '161725',
  /** 中欧医疗健康混合C */
  '003096',
  /** 鹏华国证粮食产业ETF发起式联接A */
  '021086',
  /** 长盛航天海工混合A */
  '000535',
  /** 中欧中证芯片产业指数发起A */
  '020478',
  /** 华夏中证5G通信主题ETF联接C */
  '008087',
  /** 广发中证光伏产业指数A */
  '012364',
  /** 融通中证云计算与大数据主题指数(LOF)A */
  '161628',
  /** 嘉实中证机器人ETF发起联接C */
  '024620',
]

/** 刷新间隔（秒） */
export const REFRESH_INTERVAL = 30

/**防抖延迟时间（毫秒）- 防止请求过于频繁被封 */
export const DEBOUNCE_DELAY = 500

/** 时间范围选项 */
export const TIME_RANGE_OPTIONS: Option<TimeRange, string>[] = [
  { label: '近1月', value: TIME_RANGE.Y },
  { label: '近3月', value: TIME_RANGE.THREE_Y },
  { label: '近6月', value: TIME_RANGE.SIX_Y },
  { label: '近1年', value: TIME_RANGE.ONE_N },
  { label: '近3年', value: TIME_RANGE.THREE_N },
]
