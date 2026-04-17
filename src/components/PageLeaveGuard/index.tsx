import { useEffect } from 'react'
import { useBlocker } from 'react-router-dom'
import AppModal from '@/components/AppModal'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import type { PageLeaveGuardProps } from '@/types'

/**
 * 页面离开确认组件
 *
 * 当用户尝试刷新、关闭浏览器或切换路由时，如果 `when` 为 true，
 * 会弹出确认框提示用户数据可能丢失。
 *
 * @example
 * ```tsx
 * <PageLeaveGuard when={hasUnsavedChanges} />
 * ```
 */
function PageLeaveGuard({
  when,
  message = '您有未保存的内容，离开后将丢失，确定要离开吗？',
  title = '确认离开',
}: PageLeaveGuardProps) {
  // 处理 React Router 路由切换
  const blocker = useBlocker(when)

  useEffect(() => {
    if (blocker.state === 'blocked') {
      AppModal.confirm({
        title,
        icon: <ExclamationCircleOutlined />,
        content: message,
        okText: '离开',
        cancelText: '取消',
        onOk: () => {
          blocker.proceed()
        },
        onCancel: () => {
          blocker.reset()
        },
      })
    }
  }, [blocker, message, title])

  // 处理浏览器刷新/关闭
  useEffect(() => {
    if (!when) return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = message
      return message
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [when, message])

  return null
}

export default PageLeaveGuard
