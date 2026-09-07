import type { ReactNode } from 'react'

export interface ErrorBoundaryProps {
  children: ReactNode
  /** 自定义兜底 UI；不传则使用内置错误页 */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode)
  /** 捕获后回调（可用于埋点扩展） */
  onError?: (error: Error, info: { componentStack?: string | null }) => void
  /** 嵌在布局内容区时使用（非整屏） */
  embedded?: boolean
}
