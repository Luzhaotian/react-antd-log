import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import type { ErrorBoundaryProps } from '@/types'
import ErrorFallback from '@/components/ErrorFallback'
import { logger } from '@/utils/logger'

interface State {
  error: Error | null
}

/**
 * 捕获子树渲染期错误，避免整页白屏。
 * 注意：事件处理器 / 异步回调内的错误需自行 try-catch 或走全局 handlers。
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logger.error('React 渲染错误', { error, componentStack: info.componentStack })
    this.props.onError?.(error, { componentStack: info.componentStack })
  }

  reset = () => {
    this.setState({ error: null })
  }

  render(): ReactNode {
    const { error } = this.state
    if (!error) {
      return this.props.children
    }

    const { fallback } = this.props
    if (typeof fallback === 'function') {
      return fallback(error, this.reset)
    }
    if (fallback) {
      return fallback
    }

    return <ErrorFallback error={error} onReset={this.reset} embedded={this.props.embedded} />
  }
}

export default ErrorBoundary
