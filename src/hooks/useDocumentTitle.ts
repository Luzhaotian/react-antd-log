import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getTitleByPath } from '@/config/routes'

/**
 * 根据路由自动更新浏览器标题
 */
export function useDocumentTitle() {
  const location = useLocation()

  useEffect(() => {
    const title = getTitleByPath(location.pathname)
    document.title = title
  }, [location.pathname])
}
