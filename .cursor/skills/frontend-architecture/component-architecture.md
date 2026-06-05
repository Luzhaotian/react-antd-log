# 组件架构（Component Architecture）

本文档定义项目中组件的分层体系、设计模式和编写规范。当你需要新增组件或设计组件结构时，参考此文档。

---

## 一、组件分层体系

```
┌──────────────────────────────────────────────────┐
│ Layer 1: 模板组件 (Template Components)           │
│ ListPage, PageDetail                             │
│ → 定义页面的整体骨架和布局规范                     │
├──────────────────────────────────────────────────┤
│ Layer 2: 封装组件 (Wrapper Components)            │
│ DataTable, SearchBar, Pagination, AppModal        │
│ AppDrawer                                         │
│ → 封装 antd 组件，统一行为和默认样式               │
├──────────────────────────────────────────────────┤
│ Layer 3: 功能组件 (Utility Components)            │
│ TextButton, ImagePreview, FilePreview             │
│ → 单功能、高复用的原子组件                         │
├──────────────────────────────────────────────────┤
│ Layer 4: 守卫组件 (Guard Components)              │
│ RequireAuth, PageLeaveGuard, BeforeUnload         │
│ → 控制访问权限、用户行为拦截                       │
├──────────────────────────────────────────────────┤
│ Layer 5: 业务页面 (Page Components)               │
│ Home, Fund, User/List, Tools/*                    │
│ → 组装各层组件，实现具体业务逻辑                    │
└──────────────────────────────────────────────────┘
```

---

## 二、模板组件设计

### 2.1 ListPage — 列表页模板

**职责**：为所有列表页提供统一骨架

**结构**：

```
┌─────────────────────────────────┐
│ Title + Description    [Extra]  │  ← 标题区
├─────────────────────────────────┤
│ SearchBar（可选）                │  ← 搜索区
├─────────────────────────────────┤
│ Extra 操作区（可选）              │
├─────────────────────────────────┤
│ Children（表格 + 分页）           │  ← 内容区
└─────────────────────────────────┘
```

**Props 设计原则**：

```typescript
interface ListPageProps {
  title: ReactNode // 页面标题（必填）
  description?: ReactNode // 标题下方描述
  extra?: ReactNode // 标题右侧操作区
  searchBarProps?: SearchBarProps // 可选，传入则渲染 SearchBar
  titleRight?: ReactNode // 标题右侧额外内容
  className?: string // 根节点扩展样式
  children: ReactNode // 主内容
}
```

**使用模式**：

```tsx
<ListPage
  title="用户列表"
  description="管理系统用户"
  extra={<Button type="primary">新增用户</Button>}
  searchBarProps={{ fields: [...], onSearch, onReset }}
>
  <Card size="small">
    <DataTable columns={columns} dataSource={list} rowKey="id" />
  </Card>
</ListPage>
```

### 2.2 PageDetail — 详情页/内容页模板

**职责**：为详情页、设置页、工具页提供统一布局

**结构**：

```
┌─────────────────────────────────┐
│ ← Back   Title         [Extra]  │  ← 标题区（可选返回按钮）
│          Description             │
├─────────────────────────────────┤
│ Children（详情内容）              │  ← 内容区
└─────────────────────────────────┘
```

**Props 设计原则**：

```typescript
interface PageDetailProps {
  title: ReactNode // 页面标题
  description?: ReactNode // 标题下方描述
  backTo?: string // 返回路径（设置后显示返回按钮）
  onBack?: () => void // 自定义返回回调
  extra?: ReactNode // 标题右侧操作区
  contentClassName?: string // 内容区 className
  children: ReactNode // 主体内容
}
```

**使用模式**：

```tsx
<PageDetail title="用户详情" description="查看用户信息" backTo="/user/list">
  <Card>...</Card>
</PageDetail>
```

---

## 三、封装组件设计

封装组件的核心原则：**透传原生 Props + 设置合理默认值 + 统一的加载/空态/错误态**。

### 3.1 Design Pattern

```tsx
// ✅ 好的封装模式
interface CustomCompProps extends BaseCompProps {
  // 扩展的专属属性，设置合理的默认值
  customProp?: string
}

function CustomComp({ customProp = 'default', ...restProps }: CustomCompProps) {
  return <BaseComp {...restProps} extraProp={customProp} />
}
```

### 3.2 DataTable

基于 antd Table，统一处理：

- `bordered` 默认 `true`
- `striped` 斑马纹（通过 UnoCSS 原子类）
- `emptyText` 空态文案（加载中显示 Spin）
- `autoHeight` 自适应高度（监听 window resize）
- `scroll.x` 默认 `max-content`

```tsx
<DataTable
  columns={columns}
  dataSource={list}
  loading={loading}
  rowKey="id"
  pagination={false} // 透传 antd TableProps
/>
```

### 3.3 SearchBar

基于 antd Card + Form 的行内搜索栏：

- `fields` 配置驱动，每个字段支持自定义 `render`
- `expandable` 支持展开/收起多余字段
- `onSearch` + `onReset` 统一回调

### 3.4 Pagination

基于 antd Pagination，预设合理默认值：

- 总数显示（`showTotal`）
- 快速跳转（`showQuickJumper`）
- 每页条数选择（`pageSizeOptions: ['10','20','50','100']`）

---

## 四、功能组件设计

### 4.1 TextButton

`type="text"` 的 Button 封装，链接式无背景。

- 支持 `forwardRef`
- 透传所有 `ButtonProps`（除 `type`）
- 支持 `danger` 等语义化属性

### 4.2 ImagePreview

图片缩略图 + 点击放大预览：

- 统一缩略图尺寸（默认 56x56）
- 基于 antd Image 的预览功能
- 适合在表格列中展示

### 4.3 FilePreview

本地文件预览组件：

- 支持图片（jpeg/png/gif/webp/svg/bmp）
- 支持 PDF（通过 react-pdf）
- 传入 File 对象即可

---

## 五、守卫组件设计

### 5.1 RequireAuth — 路由鉴权

```tsx
<RequireAuth>
  <MainLayout />
</RequireAuth>
```

- 检查 `localStorage` 中的登录状态
- 未登录 → `<Navigate to="/login" replace />`
- 记住来源路径 → `<Navigate to="/login" state={{ from: location }} />`

### 5.2 BeforeUnload / PageLeaveGuard

- `beforeunload` 事件：浏览器刷新/关闭时拦截
- `useBlocker`：路由切换时弹出确认弹窗
- `when` 属性控制是否启用拦截

---

## 六、页面组件设计规范

### 6.1 页面目录结构

```
pages/ModuleName/
├── index.tsx          # 主页面组件
├── components/        # 页面私有组件
│   ├── SubFeature1/
│   └── SubFeature2/
├── utils/             # 页面私有工具函数
│   └── helpers.ts
└── types.ts           # 页面私有类型（可选）
```

### 6.2 页面组件模式

```tsx
import { useState, useCallback, useEffect } from 'react'
import { Button, Card } from 'antd'
import ListPage from '@/components/ListPage'
import DataTable from '@/components/DataTable'
import type { DataType } from '@/types'
import { get } from '@/utils/request'

function UserList() {
  const [list, setList] = useState<DataType[]>([])
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async (params?: any) => {
    setLoading(true)
    try {
      const data = await get<DataType[]>('/api/users', params)
      setList(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  return (
    <ListPage title="用户列表" ...>
      <Card size="small">
        <DataTable columns={columns} dataSource={list} loading={loading} rowKey="id" />
      </Card>
    </ListPage>
  )
}
export default UserList
```

---

## 七、组件设计 Checklist

新增组件时，确保满足以下条件：

- [ ] 目录：`src/components/ComponentName/index.tsx`
- [ ] Props 类型：定义在 `src/types/components/`，命名 `XxxProps`
- [ ] 默认导出：`export default function ComponentName`
- [ ] 透传 Props：使用 `...restProps` 透传底层组件属性
- [ ] 合理默认值：Props 默认值符合大多数使用场景
- [ ] 导出类型：Props 类型可被外部 import
- [ ] 文档同步：更新 `project-components-reference.md` 和 `docs/components/`
