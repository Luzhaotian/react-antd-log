import { routes } from '@/routes'
import type { ExtendedRouteObject, MenuItem } from '@/types'
import { buildFullPath } from '@/utils'

/**
 * 从路由配置生成菜单项
 */
function generateMenuItems(routes: ExtendedRouteObject[], parentPath: string = ''): MenuItem[] {
  const items: MenuItem[] = []

  for (const route of routes) {
    // 如果没有 meta 或 hideInMenu 为 true，跳过
    if (!route.meta || route.meta.hideInMenu) {
      // 如果当前路由隐藏，但可能有子路由需要显示，继续处理子路由
      if (route.children) {
        const childItems = generateMenuItems(route.children, buildFullPath(parentPath, route.path))
        items.push(...childItems)
      }
      continue
    }

    const fullPath = buildFullPath(parentPath, route.path)
    const menuItem: MenuItem = {
      key: fullPath,
      label: route.meta.name,
    }

    // 添加图标（从路由配置中读取）
    if (route.icon) {
      menuItem.icon = route.icon
    }

    // 处理子路由
    if (route.children) {
      const children = generateMenuItems(route.children, fullPath)
      if (children.length > 0) {
        // 使用类型断言，因为 MenuItem 的 children 类型定义可能不完整
        const menuItemWithChildren = menuItem as unknown as { children: MenuItem[] }
        menuItemWithChildren.children = children
      }
    }

    items.push(menuItem)
  }

  return items
}

export const menuItems: MenuItem[] = generateMenuItems(routes)

// 获取当前选中的菜单项
export const getSelectedKeys = (pathname: string): string[] => {
  const keys: string[] = []

  // 精确匹配
  if (pathname === '/') {
    return ['/']
  }

  // 匹配子路由
  const pathSegments = pathname.split('/').filter(Boolean)
  if (pathSegments.length > 0) {
    keys.push(`/${pathSegments[0]}`)
    if (pathSegments.length > 1) {
      keys.push(pathname)
    }
  }

  return keys.length > 0 ? keys : [pathname]
}

// 获取当前展开的菜单项
export const getOpenKeys = (pathname: string): string[] => {
  const keys: string[] = []
  const pathSegments = pathname.split('/').filter(Boolean)

  if (pathSegments.length > 1) {
    let current = ''
    for (let i = 0; i < pathSegments.length - 1; i++) {
      current += `/${pathSegments[i]}`
      keys.push(current)
    }
  }

  return keys
}
