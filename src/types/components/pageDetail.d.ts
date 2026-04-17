import type { ReactNode } from 'react'

/** 页面详情组件属性 */
export interface PageDetailProps {
  /** 页面标题 */
  title: ReactNode
  /** 标题下方描述（可选） */
  description?: ReactNode
  /** 返回目标路径，设置后显示返回 */
  backTo?: string
  /** 自定义返回回调 */
  onBack?: () => void
  /** 标题右侧操作区 */
  extra?: ReactNode
  /** 子内容 */
  children: ReactNode
  /** 内容区域 className */
  contentClassName?: string
}
