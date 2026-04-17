# 公共组件使用文档

本文档介绍项目中二次封装的公共组件的使用方法。

## 组件列表

- [DataTable 组件](./components/DataTable.md) - 数据表格组件，支持加载状态、斑马纹、自动高度等功能
- [SearchBar 组件](./components/SearchBar.md) - 搜索栏组件，支持多字段搜索、展开/收起等功能
- [Pagination 组件](./components/Pagination.md) - 分页组件，支持快速跳转、每页条数选择等功能
- [TextButton 组件](./components/TextButton.md) - 文本按钮组件，统一管理 `type="text"` 的按钮
- [PageDetail 组件](./components/PageDetail.md) - 详情页统一布局，标题、描述、返回与操作区

## 快速开始

### 安装依赖

项目已包含所有必要的依赖，无需额外安装。

### 基本使用

所有组件都使用路径别名 `@/` 导入：

```tsx
import DataTable from '@/components/DataTable'
import SearchBar from '@/components/SearchBar'
import Pagination from '@/components/Pagination'
import TextButton from '@/components/TextButton'
```

### 路径别名说明

项目配置了路径别名，`@/` 指向 `src` 目录。这样可以：
- 避免使用复杂的相对路径（如 `../../../components/DataTable`）
- 提高代码可读性
- 方便重构和移动文件

**配置位置：**
- Vite: `vite.config.ts` 中的 `resolve.alias`
- TypeScript: `tsconfig.app.json` 中的 `paths`

## 完整示例

下面是一个完整的示例，展示了三个组件的组合使用：

```tsx
import { useState } from 'react'
import DataTable from '@/components/DataTable'
import SearchBar from '@/components/SearchBar'
import Pagination from '@/components/Pagination'
import type { ColumnsType } from 'antd/es/table'
import type { SearchField } from '@/components/SearchBar'

interface DataType {
  key: string
  id: number
  name: string
  email: string
  status: string
}

function UserListPage() {
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchParams, setSearchParams] = useState<Record<string, any>>({})

  // 搜索字段配置
  const searchFields: SearchField[] = [
    {
      name: 'name',
      label: '姓名',
      placeholder: '请输入姓名',
    },
    {
      name: 'email',
      label: '邮箱',
      placeholder: '请输入邮箱',
    },
  ]

  // 表格列配置
  const columns: ColumnsType<DataType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },
  ]

  // 模拟数据
  const allData: DataType[] = [
    { key: '1', id: 1, name: '张三', email: 'zhangsan@example.com', status: '活跃' },
    { key: '2', id: 2, name: '李四', email: 'lisi@example.com', status: '活跃' },
    // ... 更多数据
  ]

  // 处理搜索
  const handleSearch = (values: Record<string, any>) => {
    setSearchParams(values)
    setCurrentPage(1)
    // 执行搜索逻辑
  }

  // 处理重置
  const handleReset = () => {
    setSearchParams({})
    setCurrentPage(1)
  }

  // 过滤数据
  const filteredData = allData.filter((item) => {
    if (searchParams.name && !item.name.includes(searchParams.name)) {
      return false
    }
    if (searchParams.email && !item.email.includes(searchParams.email)) {
      return false
    }
    return true
  })

  // 分页数据
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  // 处理分页变化
  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page)
    setPageSize(size)
  }

  return (
    <div>
      {/* 搜索栏 */}
      <SearchBar
        fields={searchFields}
        expandable
        defaultExpandCount={2}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {/* 表格 */}
      <Table<DataType>
        columns={columns}
        dataSource={paginatedData}
        loading={loading}
        striped
        bordered
        pagination={false}
      />

      {/* 分页 */}
      <Pagination
        total={filteredData.length}
        current={currentPage}
        pageSize={pageSize}
        onChange={handlePageChange}
        onShowSizeChange={handlePageChange}
      />
    </div>
  )
}

export default UserListPage
```

## 通用注意事项

1. **类型安全**：所有组件都支持 TypeScript，建议使用类型定义
2. **性能优化**：大数据量时建议使用虚拟滚动或分页加载
3. **响应式**：组件已做响应式处理，移动端会自动适配
4. **样式覆盖**：如需自定义样式，可以通过 `className` 属性传入自定义类名
5. **UnoCSS 支持**：所有组件已使用 UnoCSS 进行样式处理
6. **路径别名**：所有导入都使用 `@/` 路径别名，避免相对路径混乱

## TextButton 组件

TextButton 是一个简单的文本按钮组件，统一管理 `type="text"` 的按钮。

### 基本使用

```tsx
import TextButton from '@/components/TextButton'
import { MenuFoldOutlined } from '@ant-design/icons'

<TextButton
  icon={<MenuFoldOutlined />}
  onClick={handleClick}
  className="text-base w-16 h-16"
>
  点击
</TextButton>
```

### API

TextButton 继承自 Ant Design 的 `Button` 组件，但固定了 `type="text"`，其他属性与 `Button` 完全一致。

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| ...props | Button 的所有属性（除 type） | `ButtonProps` | - |

## 相关文档

- [DataTable 组件详细文档](./components/DataTable.md)
- [SearchBar 组件详细文档](./components/SearchBar.md)
- [Pagination 组件详细文档](./components/Pagination.md)
- [TextButton 组件详细文档](./components/TextButton.md)
- [PageDetail 组件详细文档](./components/PageDetail.md)

## 最佳实践

### 1. 组件组合使用

三个组件通常一起使用，形成完整的数据展示页面：

```tsx
<SearchBar />  // 搜索
<Table />      // 数据展示
<Pagination /> // 分页
```

### 2. 状态管理

建议使用 React Hooks 管理状态：

```tsx
const [loading, setLoading] = useState(false)
const [currentPage, setCurrentPage] = useState(1)
const [pageSize, setPageSize] = useState(10)
const [searchParams, setSearchParams] = useState({})
```

### 3. 数据过滤

在客户端过滤数据时，先过滤再分页：

```tsx
// 1. 先过滤数据
const filteredData = allData.filter(/* ... */)

// 2. 再分页
const paginatedData = filteredData.slice(
  (currentPage - 1) * pageSize,
  currentPage * pageSize
)
```

### 4. 服务端分页

如果使用服务端分页，搜索和分页都应该触发 API 请求：

```tsx
const handleSearch = async (values: Record<string, any>) => {
  setSearchParams(values)
  setCurrentPage(1)
  await fetchData({ ...values, page: 1, pageSize })
}

const handlePageChange = async (page: number, size: number) => {
  setCurrentPage(page)
  setPageSize(size)
  await fetchData({ ...searchParams, page, pageSize: size })
}
```

## 更新日志

- **v1.0.0** (2024-01-20)
  - 初始版本
  - 支持 Table、SearchBar、Pagination、TextButton 组件
  - 使用 UnoCSS 进行样式处理
  - 使用路径别名 `@/` 导入组件