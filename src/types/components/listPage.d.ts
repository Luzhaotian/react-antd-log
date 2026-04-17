import type { ReactNode } from 'react'
import type { SearchBarProps } from './searchBar'

/** 列表页布局组件属性 */
export interface ListPageProps {
  /** 页面标题 */
  title: ReactNode
  /** 标题下方描述（可选） */
  description?: ReactNode
  /** 标题右侧操作区（如新增、导出按钮） */
  extra?: ReactNode
  /** 搜索栏配置，传入则渲染 SearchBar */
  searchBarProps?: SearchBarProps | null
  /** 主内容区（通常为 Card + DataTable 或自定义列表） */
  children: ReactNode
  /** 根节点 className */
  className?: string
  /** 标题右侧操作区（如新增、导出按钮） */
  titleRight?: ReactNode
}
