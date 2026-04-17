import type { FormInstance } from 'antd/es/form'
import type { ReactNode } from 'react'

/** 搜索字段 */
export interface SearchBarField {
  /** 字段名 */
  name: string
  /** 字段标签 */
  label: string
  /** 字段占位符 */
  placeholder?: string
  /** 是否必填 */
  required?: boolean
  /** 自定义渲染 */
  render?: (form: FormInstance) => ReactNode
}

/** 搜索栏组件属性 */
export interface SearchBarProps {
  /** 搜索字段 */
  fields?: SearchBarField[]
  /** 是否可展开/收起 */
  expandable?: boolean
  /** 默认展示字段数 */
  defaultExpandCount?: number
  /** 搜索提交回调 */
  onSearch?: (values: Record<string, string>) => void
  /** 重置回调 */
  onReset?: () => void
  /** 是否显示搜索按钮 */
  showSearchButton?: boolean
  /** 是否显示重置按钮 */
  showResetButton?: boolean
  /** 额外操作区 */
  extra?: ReactNode
}
