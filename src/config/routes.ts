import { routes } from '@/routes'
import type { ExtendedRouteObject } from '@/types'
import { APP_NAME } from '@/constants'
import { buildFullPath, isPathMatch } from '@/utils'

/**
 * 从路由配置中查找匹配的路由
 */
function findRouteByPath(
  routes: ExtendedRouteObject[],
  pathname: string,
  parentPath: string = ''
): ExtendedRouteObject | null {
  for (const route of routes) {
    const fullPath = buildFullPath(parentPath, route.path)

    // 先递归查找子路由（子路由更具体，优先匹配）
    if (route.children) {
      const found = findRouteByPath(route.children, pathname, fullPath)
      if (found) {
        return found
      }
    }

    // 如果当前路由匹配，返回当前路由
    if (isPathMatch(fullPath, pathname)) {
      return route
    }
  }

  return null
}

/**
 * 根据路径获取标题
 */
export const getTitleByPath = (pathname: string): string => {
  const route = findRouteByPath(routes, pathname)

  if (route?.meta?.name) {
    return `${route.meta.name} - ${APP_NAME}`
  }

  return APP_NAME
}
