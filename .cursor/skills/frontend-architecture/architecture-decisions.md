# 架构决策（Architecture Decisions）

本文档记录项目的核心技术选型依据、架构模式和设计原则。当你需要理解「为什么这样做」或做新的技术决策时，参考此文档。

---

## 一、技术选型理由

| 技术               | 选型理由                                 | 替代方案（不推荐）               |
| ------------------ | ---------------------------------------- | -------------------------------- |
| **React 19**       | 最新稳定版，函数组件 + Hooks 生态成熟    | Vue / Angular（切换成本高）      |
| **TypeScript**     | 类型安全，减少运行时错误，IDE 智能提示   | JavaScript（无类型，难维护）     |
| **Ant Design 6**   | 企业级后台 UI 标配，组件齐全，中文生态好 | MUI / shadcn/ui / Arco Design    |
| **Vite 7**         | 极快的 HMR，原生 ESM，构建快             | Webpack / Turbopack              |
| **React Router 7** | 数据路由、懒加载、View Transitions 支持  | TanStack Router                  |
| **UnoCSS**         | 按需生成原子 CSS，极致性能               | Tailwind CSS / styled-components |
| **无全局状态库**   | 项目规模适中，React 内置够用             | Redux / Zustand / MobX           |

### 关键决策：为什么不用全局状态库

```
✅ React useState + useReducer       → 页面/组件局部状态
✅ localStorage + IndexedDB          → 持久化状态
✅ React Router loader/state         → 路由级共享状态
✅ 自定义 Hooks                      → 逻辑复用

❌ Redux/Zustand 对当前项目是过度设计：
   - 项目没有跨多层级、跨多模块的复杂共享状态
   - 引入后增加样板代码、学习成本和包体积
   - 如需引入，优先 Zustand（轻量、简洁、TS 友好）
```

---

## 二、架构模式

### 2.1 Application Shell 模式

```
main.tsx (入口)
  ├── dayjs 配置（中文 + 上海时区）
  ├── ConfigProvider（Ant Design 主题 + 国际化）
  │   └── RouterProvider
  │       ├── /login  → Login（无布局）
  │       └── /       → RequireAuth → MainLayout → Outlet
  │           ├── Sider（Logo + Menu）
  │           ├── Header（CollapseBtn + Breadcrumb + UserDropdown）
  │           └── Content（Suspense + ViewTransition + Outlet）
```

**设计原则**：

- `/login` 路径独立，不包裹在 MainLayout 中
- 所有需要认证的页面统一走 `RequireAuth` 守卫 + `MainLayout` 布局
- `Outlet` 作为内容渲染点，子路由通过 `children` 配置

### 2.2 路由驱动架构

**菜单、面包屑、页面标题全部从路由配置自动生成**，避免手动维护。

```
路由配置 (routes/modules/*.tsx)
  │
  ├──→ menu.tsx        → 生成 Sider 菜单项（过滤 hideInMenu）
  ├──→ Breadcrumb      → 根据 pathname 生成面包屑
  └──→ routes.ts       → getTitleByPath() → document.title
```

**扩展路由类型** (`ExtendedRouteObject`)：

```typescript
{
  path: '/user',
  icon: <UserOutlined />,      // 菜单图标
  meta: {
    name: '用户管理',           // 菜单名 + 面包屑 + 页面标题
    hideInMenu: false,         // 是否在菜单中隐藏
  },
  children: [...]
}
```

### 2.3 组件分层架构

```
┌──────────────────────────────────┐
│     模板组件（Template）          │  ← ListPage, PageDetail
│     定义页面骨架和统一布局         │
├──────────────────────────────────┤
│     封装组件（Wrapper）           │  ← DataTable, SearchBar, Pagination, AppModal, AppDrawer
│     封装 antd 组件，统一行为和样式  │
├──────────────────────────────────┤
│     功能组件（Utility）           │  ← TextButton, ImagePreview, FilePreview
│     提供特定功能的可复用单元        │
├──────────────────────────────────┤
│     守卫组件（Guard）             │  ← RequireAuth, PageLeaveGuard, BeforeUnload
│     控制访问权限和用户行为          │
├──────────────────────────────────┤
│     业务页面（Page）              │  ← Home, Fund, User/List, Tools/*
│     拼装组件实现具体业务           │
└──────────────────────────────────┘
```

**选用优先级**：模板组件 > 封装组件 > antd 组件 > 自定义实现

### 2.4 双路由模式

```
开发/自有服务器 → BrowserRouter（createBrowserRouter）
GitHub Pages     → HashRouter（createHashRouter，通过 VITE_HASH_ROUTER 环境变量切换）
```

Hash 路由兼容旧书签的自动重定向逻辑在 `main.tsx` 中处理。

---

## 三、性能策略

### 3.1 代码分割

- **所有页面组件使用 `React.lazy()` 动态导入**
- `Suspense` 包裹在 Content 层级，统一 loading 态

```tsx
const UserList = lazy(() => import('@/pages/User/List'))
```

### 3.2 渲染优化

| 手段          | 使用场景                         | 示例                     |
| ------------- | -------------------------------- | ------------------------ |
| `useCallback` | 传给子组件的事件处理函数         | MainLayout 所有 handler  |
| `useMemo`     | 昂贵计算、派生数据               | menuState、userMenuItems |
| `useStableFn` | 回调需要稳定引用但访问最新 state | addEventListener         |
| `memo`        | 纯展示组件，props 不变时不重渲染 | 视需要添加               |

### 3.3 View Transitions

使用原生 CSS View Transitions API 实现页面切换动画：

```tsx
// 导航时启用
navigate(key, { viewTransition: true })

// CSS 动画定义
::view-transition-old(page-content) { animation: ... }
::view-transition-new(page-content) { animation: ... }
```

### 3.4 按需加载

- **UnoCSS**：按需生成原子 CSS，无冗余样式
- **antd**：按需导入组件，不全局注册
- **dayjs**：按需加载 locale 和 plugin

---

## 四、设计原则总结

| 原则             | 说明                                                |
| ---------------- | --------------------------------------------------- |
| **单一职责**     | 每个组件/模块只做一件事                             |
| **路由驱动**     | 路由是 UI 结构的数据源，避免手动维护菜单/面包屑     |
| **模板优先**     | 优先使用 ListPage/PageDetail 等模板组件统一页面结构 |
| **组合优于继承** | 通过组件组合而非继承实现复用                        |
| **显式数据流**   | 数据从上到下（props），事件从下到上（callback）     |
| **最小依赖**     | 能用原生 API 就不用第三方库                         |
| **渐进增强**     | 简单功能简单实现，复杂场景再引入复杂方案            |

---

## 五、禁止的架构模式

| 模式                      | 原因                  | 替代方案                    |
| ------------------------- | --------------------- | --------------------------- |
| ❌ 相对路径导入（跨目录） | 重构时脆弱，可读性差  | ✅ 使用 `@/` 别名           |
| ❌ any 类型               | 失去类型安全          | ✅ 定义具体类型或 `unknown` |
| ❌ 在组件内直接操作 DOM   | 违反 React 声明式范式 | ✅ 使用 ref + useEffect     |
| ❌ 轮询代替 WebSocket     | 浪费资源              | ✅ 需要实时用 WebSocket/SSE |
| ❌ 单个大组件             | 难以维护和测试        | ✅ 拆分小组件               |
| ❌ 魔数/硬编码字符串      | 含义不明，修改困难    | ✅ 定义常量                 |
