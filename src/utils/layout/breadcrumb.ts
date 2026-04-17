import type { ExtendedRouteObject } from '@/types'

/**
 * 构建完整路径
 */
export const buildFullPath = (parentPath: string, routePath: string | undefined): string => {
  if (!routePath) return parentPath

  if (routePath.startsWith('/')) {
    return routePath
  }

  if (parentPath === '/') {
    return `/${routePath}`
  }

  if (routePath === '') {
    return parentPath
  }

  return `${parentPath}/${routePath}`
}

/**
 * 检查路径是否匹配（支持动态路由）
 */
export const isPathMatch = (routePath: string, pathname: string): boolean => {
  if (routePath === pathname) {
    return true
  }

  if (routePath.includes(':')) {
    const pattern = routePath.replace(/:[^/]+/g, '[^/]+').replace(/\?/g, '')
    const regex = new RegExp(`^${pattern}$`)
    return regex.test(pathname)
  }

  return false
}

/**
 * 查找路由路径的所有父级路由
 */
export const findRoutePath = (
  routes: ExtendedRouteObject[],
  pathname: string,
  parentPath: string = '',
  parentList: Array<{ path: string; name: string }> = []
): Array<{ path: string; name: string }> | null => {
  for (const route of routes) {
    const fullPath = buildFullPath(parentPath, route.path)

    // 先递归查找子路由（子路由更具体，优先匹配）
    if (route.children) {
      // 构建当前父级列表：如果当前路由有 meta，添加到父级列表
      const currentParentList = route.meta?.name
        ? [...parentList, { path: fullPath, name: route.meta.name }]
        : parentList

      const found = findRoutePath(route.children, pathname, fullPath, currentParentList)
      if (found) {
        return found
      }
    }

    // 如果当前路由匹配
    if (isPathMatch(fullPath, pathname)) {
      const result = [...parentList]
      if (route.meta?.name) {
        result.push({ path: fullPath, name: route.meta.name })
      }
      return result.length > 0 ? result : null
    }
  }

  return null
}
