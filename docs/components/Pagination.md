# Pagination 组件

基于 Ant Design Pagination 的二次封装组件，提供了更便捷的配置选项。

## 引入方式

```tsx
import Pagination from '@/components/Pagination'
```

## 基本用法

```tsx
import Pagination from '@/components/Pagination'

function MyComponent() {
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const total = 100

  const handlePageChange = (page: number, size: number) => {
    setCurrent(page)
    setPageSize(size)
    // 执行分页查询
  }

  return (
    <Pagination
      total={total}
      current={current}
      pageSize={pageSize}
      onChange={handlePageChange}
      onShowSizeChange={handlePageChange}
    />
  )
}
```

## API

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| total | 总数 | `number` | `0` |
| current | 当前页码 | `number` | `1` |
| pageSize | 每页条数 | `number` | `10` |
| showTotal | 是否显示总数 | `boolean` | `true` |
| showQuickJumper | 是否显示快速跳转 | `boolean` | `true` |
| showSizeChanger | 是否显示每页条数选择器 | `boolean` | `true` |
| pageSizeOptions | 每页条数选项 | `string[]` | `['10', '20', '50', '100']` |
| defaultPageSize | 默认每页条数 | `number` | `10` |
| onChange | 页码改变回调 | `(page: number, pageSize: number) => void` | - |
| onShowSizeChange | 每页条数改变回调 | `(current: number, size: number) => void` | - |
| ...restProps | 其他 Antd Pagination 属性 | `PaginationProps` | - |

## 功能特性

- ✅ **显示总数**：自动显示"共 X 条"
- ✅ **快速跳转**：支持快速跳转到指定页码
- ✅ **每页条数选择**：支持自定义每页显示条数
- ✅ **响应式布局**：移动端自动隐藏部分选项

## 高级用法

### 自定义每页条数选项

```tsx
<Pagination
  total={total}
  current={current}
  pageSize={pageSize}
  pageSizeOptions={['5', '10', '20', '50']} // 自定义选项
  onChange={handlePageChange}
  onShowSizeChange={handlePageChange}
/>
```

### 隐藏部分功能

```tsx
<Pagination
  total={total}
  current={current}
  pageSize={pageSize}
  showTotal={false} // 隐藏总数
  showQuickJumper={false} // 隐藏快速跳转
  onChange={handlePageChange}
/>
```

### 完整示例

```tsx
import { useState } from 'react'
import Pagination from '@/components/Pagination'

function UserListPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const total = 100

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page)
    setPageSize(size)
    // 执行分页查询
  }

  return (
    <Pagination
      total={total}
      current={currentPage}
      pageSize={pageSize}
      onChange={handlePageChange}
      onShowSizeChange={handlePageChange}
    />
  )
}

export default UserListPage
```

## 注意事项

1. **类型安全**：组件支持 TypeScript，建议使用类型定义
2. **响应式**：组件已做响应式处理，移动端会自动隐藏部分选项
3. **样式覆盖**：如需自定义样式，可以通过 `className` 属性传入自定义类名
4. **UnoCSS 支持**：组件已使用 UnoCSS 进行样式处理
5. **路径别名**：使用 `@/components/Pagination` 导入，避免相对路径混乱
6. **回调函数**：`onChange` 和 `onShowSizeChange` 都会传递 `(page, pageSize)` 参数，可以复用同一个处理函数

## 更新日志

- **v1.0.0** (2024-01-20)
  - 初始版本
  - 支持显示总数、快速跳转、每页条数选择等功能
