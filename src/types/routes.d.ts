/**
 * 路由相关类型定义
 */
import type { RouteObject } from 'react-router-dom'
import type { ReactNode } from 'react'

/** Meta 配置接口 */
export interface RouteMeta {
  /** 名称 */
  name: string
  /** 是否隐藏在菜单中 */
  hideInMenu?: boolean
}

/** 扩展 RouteObject 类型，添加 meta 和 icon 字段 */
export type ExtendedRouteObject = RouteObject & {
  /** Meta 配置 */
  meta?: RouteMeta
  /** 图标 */
  icon?: ReactNode
  /** 子路由 */
  children?: ExtendedRouteObject[]
}
