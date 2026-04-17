import type React from 'react'

/** 活动 */
export interface Activity {
  /** 活动ID */
  id: number
  /** 活动标题 */
  title: string
  /** 活动时间 */
  time: string
  /** 活动分类 */
  category: string
  /** 活动状态，可选值为 'new' 或 'completed' */
  status: 'new' | 'completed'
}
/** 趋势数据 */
export interface TrendData {
  /** 日期 */
  date: string
  /** 值 */
  value: number
}

/** 分类数据 */
export interface CategoryData {
  /** 类型 */
  type: string
  /** 值 */
  value: number
}

/** 饼图数据 */
export interface PieData {
  /** 类型 */
  type: string
  /** 值 */
  value: number
}

/** 性能数据 */
export interface PerformanceData {
  /** 标签 */
  label: string
  /** 值 */
  value: number
  /** 颜色 */
  color: string
}

/** 分类图表数据 */
export interface CategoryChartProps {
  /** 数据 */
  data: CategoryData[]
}

/** 页面头部数据 */
export interface PageHeaderProps {
  /** 标题 */
  title?: string
  /** 副标题 */
  subtitle?: string
}

/** 操作项 */
export interface ActionItem {
  /** 图标 */
  icon: React.ReactNode
  /** 标题 */
  title: string
  /** 描述 */
  description: string
  /** 背景颜色 */
  bgColor: string
  /** 图标颜色 */
  iconColor: string
}

/** 最近活动数据 */
export interface RecentActivitiesProps {
  /** 活动列表 */
  activities: Activity[]
}

/** 统计卡片数据 */
export interface StatisticCardData {
  /** 标题 */
  title: string
  /** 值 */
  value: number
  /** 前缀 */
  prefix: React.ReactNode
  /** 后缀 */
  suffix?: React.ReactNode
  /** 内容颜色 */
  contentColor: string
  /** 图标背景颜色 */
  iconBgColor: string
  /** 图标颜色 */
  iconColor: string
  /** 悬停颜色 */
  hoverColor: string
  /** 点击回调 */
  onClick?: () => void
}

/** 状态饼图数据 */
export interface StatusPieChartProps {
  /** 数据 */
  data: PieData[]
}

/** 系统性能数据 */
export interface SystemPerformanceProps {
  /** 数据 */
  data: PerformanceData[]
}

/** 趋势图表数据 */
export interface TrendChartProps {
  /** 数据 */
  data: TrendData[]
}
