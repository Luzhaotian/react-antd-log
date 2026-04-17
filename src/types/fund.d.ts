/**
 * 基金相关类型定义
 */
import type React from 'react'

/** 基金基本信息 */
export interface FundInfo {
  /** 基金代码 */
  FCODE: string
  /** 基金简称 */
  SHORTNAME: string
  /** 净值日期 */
  PDATE: string
  /** 净值 */
  NAV: string
  /** 估算净值 */
  GSZ: string
  /** 估算净值增长率 */
  GSZZL: string
  /** 估算净值时间 */
  GZTIME: string
  /** 昨日涨跌幅 */
  NAVCHGRT: string
  /** 累计净值 */
  ACCNAV?: string
}

/** 分红信息 */
export interface FundBonus {
  /** 分红日期 */
  PDATE: string
  /** 分红比例 */
  CHGRATIO: string
}

/** 基金详细信息 */
export interface FundDetailInfo {
  /** 基金代码 */
  FCODE: string
  /** 一年收益率 */
  SYL_Y: string
  /** 三年收益率 */
  SYL_3Y: string
  /** 六年收益率 */
  SYL_6Y: string
  /** 十年收益率 */
  SYL_1N: string
  /** 一年排名 */
  RANKM: string
  /** 季度排名 */
  RANKQ: string
  /** 半年排名 */
  RANKHY: string
  /** 年排名 */
  RANKY: string
  /** 单位净值 */
  DWJZ: string
  /** 累计净值 */
  LJJZ: string
  /** 申购状态 */
  FSRQ: string
  /** 基金类型 */
  FTYPE: string
  /** 基金公司 */
  JJGS: string
  /** 基金经理 */
  JJJL: string
  /** 成立日期 */
  FSRQ: string
  /** 申购状态 */
  SGZT: string
  /** 赎回状态 */
  SHZT: string
  /** 基金规模 */
  ENDNAV: string
  /** 分红信息 */
  FUNDBONUS?: FundBonus
}

/** 估值数据 */
export interface ValuationData {
  /** 日期 */
  date: string
  /** 时间 */
  time: string
  /** 值 */
  value: string
}

/** 收益率数据 */
export interface YieldData {
  /** 日期 */
  PDATE: string
  /** 收益率 */
  YIELD: string
  /** 指数收益率 */
  INDEXYIED: string
}

/** 净值数据 */
export interface NetValueData {
  /** 日期 */
  FSRQ: string
  /** 单位净值 */
  DWJZ: string
  /** 累计净值 */
  LJJZ: string
  /** 净值增长率 */
  JZZZL: string
}

/** 持仓股票 */
export interface FundStock {
  /** 股票代码 */
  GPDM: string
  /** 股票简称 */
  GPJC: string
  /** 最新行情 */
  NEWTEXCH: string
  /** 净值比例 */
  JZBL: string
  /** 净值涨跌幅 */
  PCTNVCHG: string
  /** 净值涨跌幅类型 */
  PCTNVCHGTYPE: string
}

/** 基金经理 */
export interface FundManager {
  /** 基金经理ID */
  MGRID: string
  /** 基金经理名称 */
  MGRNAME: string
  /** 任职开始日期 */
  FEMPDATE: string
  /** 任职结束日期 */
  LEMPDATE: string
  /** 任职天数 */
  DAYS: string
  /** 任职平均增长率 */
  PENAVGROWTH: string
  /** 照片URL */
  PHOTOURL?: string
  /** 简历 */
  RESUME?: string
}

/** 时间范围类型（与 constants/fund TIME_RANGE 一致） */
export type TimeRange = 'y' | '3y' | '6y' | 'n' | '3n' | '5n'

/** 图表类型（与 constants/fund CHART_TYPE 一致） */
export type ChartType = 'valuation' | 'yield' | 'netValue'

/** 实时估值 API 返回的数据结构 */
export interface RealtimeValuationResponse {
  /** 基金代码 */
  fundcode: string
  /** 基金简称 */
  name: string
  /** 净值日期 */
  jzrq: string
  /** 单位净值 */
  dwjz: string
  /** 估算净值 */
  gsz: string
  /** 估算净值增长率 */
  gszzl: string
  /** 估算净值时间 */
  gztime: string
}

/** 基金基本信息 */
export interface FundBaseInfo {
  /** 基金代码 */
  FCODE: string
  /** 基金简称 */
  SHORTNAME: string
  /** 基金类型 */
  FTYPE: string
  /** 基金公司 */
  JJGS: string
  /** 单位净值 */
  DWJZ: number
}

/** 基金搜索结果项 */
export interface FundSearchResult {
  /** 基金代码 */
  CODE: string
  /** 基金简称 */
  NAME: string
  /** 基金公司 */
  JP: string
  /** 基金类型 */
  CATEGORY: number
  /** 基金类型描述 */
  CATEGORYDESC: string
  /** 基金基本信息 */
  FundBaseInfo?: FundBaseInfo
}

/** 当日估值分时走势数据点 */
export interface GzTrendPoint {
  /** x坐标 */
  x: number
  /** y坐标 */
  y: number
}

/** pingzhongdata 接口返回的部分数据结构 */
export interface PingzhongData {
  /** 估值分时走势数据 */
  Data_gzTrend?: GzTrendPoint[]
  /** 净值分时走势数据 */
  Data_netWorthTrend?: Array<{
    /** x坐标 */
    x: number
    /** y坐标 */
    y: number
    /** 净值收益率 */
    equityReturn: number
    /** 单位金额 */
    unitMoney: string
  }>
  /** 基金名称 */
  fS_name?: string
  /** 基金代码 */
  fS_code?: string
}

/** 图表弹窗组件属性 */
export interface ChartModalProps {
  /** 是否打开 */
  open: boolean
  /** 基金 */
  fund: FundInfo | null
  /** 关闭回调 */
  onClose: () => void
}

/** 基金详情弹窗组件属性 */
export interface FundDetailModalProps {
  /** 是否打开 */
  open: boolean
  /** 基金 */
  fund: FundInfo | null
  /** 关闭回调 */
  onClose: () => void
}

/** 基金搜索组件属性 */
export interface FundSearchProps {
  /** 基金代码列表 */
  fundCodes: string[]
  /** 基金列表 */
  funds: FundInfo[]
  /** 基金代码改变回调 */
  onFundCodesChange: (codes: string[]) => void
  /** 刷新回调 */
  onRefresh: () => void
  /** 是否加载中 */
  loading: boolean
}

/** 基金表格组件属性 */
export interface FundTableProps {
  /** 数据源 */
  dataSource: FundInfo[]
  /** 是否加载中 */
  loading: boolean
  /** 查看详情回调 */
  onViewDetail: (fund: FundInfo) => void
  /** 查看图表回调 */
  onViewChart: (fund: FundInfo) => void
  /** 删除回调 */
  onDelete?: (fundCode: string) => void
  /** 重新排序回调 */
  onReorder?: (newOrder: string[]) => void
}

/** 拖拽行上下文 */
export interface RowContextProps {
  /** 设置激活节点引用 */
  setActivatorNodeRef?: (element: HTMLElement | null) => void
  /** 监听器 */
  listeners?: Record<string, Function>
}

/** 可排序行组件 */
export interface SortableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /** 行键 */
  'data-row-key': string
}

/** 统计卡片组件属性 */
export interface StatisticsCardsProps {
  /** 基金列表 */
  funds: FundInfo[]
}
