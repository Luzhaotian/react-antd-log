import { Button, Result, Typography } from 'antd'
import { HomeOutlined, ReloadOutlined } from '@ant-design/icons'
import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { APP_NAME } from '@/constants'

interface ErrorFallbackProps {
  error?: unknown
  onReset?: () => void
  title?: string
  /** 嵌在布局内容区时不使用全屏高度 */
  embedded?: boolean
}

function goHome() {
  const useHash = import.meta.env.VITE_HASH_ROUTER === 'true'
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/')
  if (useHash) {
    window.location.hash = '#/'
    return
  }
  window.location.assign(`${window.location.origin}${base}`)
}

function resolveMessage(error: unknown): {
  status: 'error' | '404' | '403'
  title: string
  sub: string
} {
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return { status: '404', title: '404', sub: '抱歉，您访问的页面不存在。' }
    }
    if (error.status === 403) {
      return { status: '403', title: '403', sub: '抱歉，您无权访问该页面。' }
    }
    return {
      status: 'error',
      title: String(error.status),
      sub: error.statusText || '页面加载失败',
    }
  }

  if (error instanceof Error) {
    return {
      status: 'error',
      title: '页面出错了',
      sub: import.meta.env.DEV ? error.message : '请稍后重试，或返回首页继续使用。',
    }
  }

  return {
    status: 'error',
    title: '页面出错了',
    sub: '发生未知错误，请刷新页面或返回首页。',
  }
}

/** 统一错误兜底 UI（不依赖 Router context，可在顶层 ErrorBoundary 使用） */
function ErrorFallback({ error, onReset, title, embedded }: ErrorFallbackProps) {
  const { status, title: defaultTitle, sub } = resolveMessage(error)

  return (
    <div className={embedded ? 'flex-center min-h-[320px] px-4' : 'min-h-screen flex-center px-4'}>
      <Result
        status={status}
        title={title ?? defaultTitle}
        subTitle={sub}
        extra={
          <div className="flex-center gap-3 flex-wrap">
            {onReset ? (
              <Button type="primary" icon={<ReloadOutlined />} onClick={onReset}>
                重试
              </Button>
            ) : (
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={() => window.location.reload()}
              >
                刷新页面
              </Button>
            )}
            <Button icon={<HomeOutlined />} onClick={goHome}>
              返回首页
            </Button>
          </div>
        }
      >
        {import.meta.env.DEV && error instanceof Error && error.stack ? (
          <Typography.Paragraph
            type="secondary"
            className="text-left max-w-2xl mx-auto whitespace-pre-wrap text-xs"
          >
            {error.stack}
          </Typography.Paragraph>
        ) : null}
        <Typography.Text type="secondary" className="text-xs">
          {APP_NAME}
        </Typography.Text>
      </Result>
    </div>
  )
}

/** 供 React Router `errorElement` 使用 */
export function RouteErrorPage() {
  const error = useRouteError()
  return <ErrorFallback error={error} />
}

export default ErrorFallback
