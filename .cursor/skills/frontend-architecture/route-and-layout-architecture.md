# 路由与布局架构（Route & Layout Architecture）

本文档定义项目中的路由设计、布局组件和导航体系。当你需要添加路由、设计布局或调整导航时，参考此文档。

---

## 一、路由架构总览

### 1.1 路由树结构

```
RouterProvider
├── /login                    → Login（无布局，无鉴权）
└── /                         → RequireAuth → MainLayout
    ├── /                     → Home（首页仪表盘）
    ├── /invest
    │   └── fund              → Fund（基金实时监控）
    ├── /tools
    │   ├── code-compress     → CodeCompress
    │   ├── json-viewer        → JsonViewer
    │   ├── file-rename        → FileRename
    │   └── qrcode             → QrCode
    ├── /user
    │   ├── list               → UserList
    │   └── detail/:id?        → UserDetail（动态路由）
    ├── /user-requirement
    │   ├── mortgage-list      → MortgageList
    │   └── car-loan-list      → CarLoanList
    ├── /settings
    │   ├── basic              → BasicSettings
    │   └── advanced           → AdvancedSettings
    ├── /test/*                → 设计稿测试页
    └── *                      → NotFound（404）
```

### 1.2 路由类型定义

```typescript
// src/types/routes.d.ts
interface RouteMeta {
  name: string // 名称（菜单/面包屑/标题共用）
  hideInMenu?: boolean // 是否隐藏在菜单中
}

type ExtendedRouteObject = RouteObject & {
  meta?: RouteMeta
  icon?: ReactNode // 菜单图标（antd icon 组件）
  children?: ExtendedRouteObject[]
}
```

---

## 二、路由模块化

### 2.1 文件组织

```
src/routes/
├── index.tsx                  # 汇总所有路由
├── modules/                   # 按功能模块拆分
│   ├── home.tsx               # 首页路由
│   ├── invest.tsx             # 投资理财路由
│   ├── tools.tsx              # 工具包路由
│   ├── user.tsx               # 用户管理路由
│   ├── userRequirement.tsx    # 用户需求路由
│   ├── settings.tsx           # 设置路由
│   ├── test.tsx               # 测试路由
│   └── error.tsx              # 404 路由
```

### 2.2 路由模块示例

```tsx
// src/routes/modules/user.tsx
import { lazy } from 'react'
import { UserOutlined } from '@ant-design/icons'
import type { ExtendedRouteObject } from '@/types'

const UserList = lazy(() => import('@/pages/User/List'))
const UserDetail = lazy(() => import('@/pages/User/Detail'))

const userRoutes: ExtendedRouteObject[] = [
  {
    path: '/user',
    icon: <UserOutlined />,
    meta: { name: '用户管理' },
    children: [
      {
        path: 'list',
        element: <UserList />,
        meta: { name: '用户列表' },
      },
      {
        path: 'detail/:id?', // :id? 表示可选参数
        element: <UserDetail />,
        meta: {
          name: '用户详情',
          hideInMenu: true, // 详情页不在菜单显示
        },
      },
    ],
  },
]
export default userRoutes
```

### 2.3 路由汇总

```tsx
// src/routes/index.tsx
import homeRoutes from './modules/home'
import investRoutes from './modules/invest'
import toolsRoutes from './modules/tools'
// ...

export const routes = [
  ...homeRoutes,
  ...investRoutes,
  ...toolsRoutes,
  // ...
]
```

---

## 三、路由驱动体系

### 3.1 菜单生成

```typescript
// src/layout/config/menu.tsx
// 从路由配置自动生成 antd Menu items
function buildMenuItems(routes: ExtendedRouteObject[]): MenuProps['items'] {
  return routes
    .filter(route => !route.meta?.hideInMenu) // 过滤隐藏项
    .map(route => ({
      key: route.path,
      icon: route.icon,
      label: route.meta?.name,
      children: route.children ? buildMenuItems(route.children) : undefined,
    }))
}
```

### 3.2 面包屑生成

```typescript
// 从 pathname 解析面包屑路径
// /user/detail/123 → [{ title: '用户管理', path: '/user' }, { title: '用户详情' }]
function getBreadcrumbByPath(pathname: string): BreadcrumbItem[] {
  // 逐级匹配路由配置，拼接面包屑
}
```

### 3.3 页面标题

```typescript
// src/config/routes.ts → getTitleByPath()
// 根据当前 pathname 查找对应的 meta.name
// document.title = `${routeName} - ${APP_NAME}`
```

**核心原则：添加新路由后，菜单、面包屑、页面标题自动生效，无需额外配置。**

---

## 四、布局组件

### 4.1 MainLayout 结构

```
Layout (min-h-screen, UnoCSS)
├── Sider (可折叠, 200px, dark 主题)
│   ├── Logo (展开/收起动画)
│   └── Menu (从路由自动生成)
│       ├── selectedKeys → getSelectedKeys(pathname)
│       ├── openKeys     → getOpenKeys(pathname)
│       └── onClick      → navigate(key, { viewTransition: true })
└── Layout
    ├── Header
    │   ├── 折叠按钮 (MenuFoldOutlined / MenuUnfoldOutlined)
    │   ├── Breadcrumb (自动生成面包屑)
    │   └── 用户 Dropdown (退出登录)
    └── Content
        ├── 背景色 + 圆角（antd token）
        ├── Suspense（Spin 加载态）
        └── View Transition 容器
            └── <Outlet />
```

### 4.2 MainLayout 设计要点

- **Memo 优化**：`menuState` 使用 `useMemo`，避免每次渲染重新计算
- **事件处理**：所有 handler 使用 `useCallback`，传给子组件时引用稳定
- **View Transitions**：`navigate(key, { viewTransition: true })` 启用页面切换动画
- **antd Token**：通过 `theme.useToken()` 获取主题变量，保持一致性

### 4.3 添加新页面步骤

```
1. 创建页面组件
   src/pages/NewModule/index.tsx

2. 添加路由配置
   src/routes/modules/newModule.tsx

3. 在 routes/index.tsx 中导入并合并

4. 自动生效：
   ✅ 菜单项（除非 hideInMenu: true）
   ✅ 面包屑
   ✅ 页面标题
   ✅ 路由鉴权（继承自 / 的 RequireAuth）
```

---

## 五、导航守卫

### 5.1 认证守卫

```tsx
// src/main.tsx — 路由树配置
const routeTree = [
  {
    path: '/login',
    element: <Login />, // 无守卫，直接渲染
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        {' '}
        // 需要登录
        <MainLayout />
      </RequireAuth>
    ),
    children: routes, // 所有子路由都受保护
  },
]
```

```tsx
// src/components/RequireAuth — 守卫实现
function RequireAuth({ children }) {
  const location = useLocation()
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
```

### 5.2 离开确认

```tsx
// src/components/BeforeUnload
// 浏览器刷新/关闭 → beforeunload 事件
// 路由切换 → useBlocker + Modal 确认
<BeforeUnload when={hasUnsavedChanges} message="您有未保存的内容..." />
```

---

## 六、路由设计原则

| 原则             | 说明                                               |
| ---------------- | -------------------------------------------------- |
| **模块化**       | 每个功能模块独立路由文件                           |
| **懒加载**       | 所有页面组件使用 `React.lazy()`                    |
| **路由驱动**     | 菜单/面包屑/标题从路由生成                         |
| **父路由做布局** | 父路由包裹 MainLayout，子路由是具体页面            |
| **参数路由**     | 详情页用 `:id?`（可选参数），支持新增/编辑复用     |
| **hideInMenu**   | 详情页/弹窗路由不在菜单显示                        |
| **双路由模式**   | BrowserRouter（开发） / HashRouter（GitHub Pages） |

---

## 七、路由 Checklist

新增路由时，确保：

- [ ] 路由文件放在 `src/routes/modules/` 下
- [ ] 页面组件用 `React.lazy(() => import(...))` 动态导入
- [ ] `meta.name` 设置为中文名称
- [ ] 菜单项设置合适的 `icon`
- [ ] 详情页/弹窗路由设置 `hideInMenu: true`
- [ ] 在 `src/routes/index.tsx` 中合并路由
- [ ] 不需要单独处理菜单/面包屑/标题（自动生效）
