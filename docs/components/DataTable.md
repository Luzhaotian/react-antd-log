# DataTable 组件

基于 Ant Design Table 的二次封装组件，提供了额外的功能和样式优化。命名为 DataTable 以区分 Ant Design 原生 Table。

## 引入方式

```tsx
import DataTable from '@/components/DataTable'
```

## 基本用法

```tsx
import DataTable from '@/components/DataTable'
import type { ColumnsType } from 'antd/es/table'

interface DataType {
  key: string
  id: number
  name: string
  email: string
}

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
]

const data: DataType[] = [
  { key: '1', id: 1, name: '张三', email: 'zhangsan@example.com' },
  { key: '2', id: 2, name: '李四', email: 'lisi@example.com' },
]

function MyComponent() {
  return (
    <DataTable
      columns={columns}
      dataSource={data}
      loading={false}
      striped
      bordered
    />
  )
}
```

## API

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| dataSource | 数据源 | `T[]` | `[]` |
| loading | 是否加载中 | `boolean` | `false` |
| bordered | 是否显示边框 | `boolean` | `true` |
| striped | 是否显示斑马纹 | `boolean` | `true` |
| emptyText | 空数据提示文本 | `string` | `'暂无数据'` |
| autoHeight | 自动高度（占满剩余空间） | `boolean` | `false` |
| ...restProps | 其他 Antd Table 属性 | `TableProps<T>` | - |

## 功能特性

- ✅ **加载状态**：支持 loading 状态显示
- ✅ **斑马纹样式**：通过 `striped` 属性启用
- ✅ **自动高度**：通过 `autoHeight` 属性自动计算表格高度
- ✅ **自定义空数据提示**：通过 `emptyText` 自定义空数据提示
- ✅ **完全兼容**：支持 Antd Table 的所有原生属性

## 高级用法

### 自动高度

```tsx
<DataTable
  columns={columns}
  dataSource={data}
  autoHeight // 自动计算高度，占满剩余空间
/>
```

### 自定义空数据提示

```tsx
<DataTable
  columns={columns}
  dataSource={[]}
  emptyText="暂无数据，请稍后再试"
/>
```

### 完整示例

```tsx
import { useState } from 'react'
import DataTable from '@/components/DataTable'
import type { ColumnsType } from 'antd/es/table'

interface DataType {
  key: string
  id: number
  name: string
  email: string
  status: string
}

function UserListPage() {
  const [loading, setLoading] = useState(false)
  
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

  const data: DataType[] = [
    { key: '1', id: 1, name: '张三', email: 'zhangsan@example.com', status: '活跃' },
    { key: '2', id: 2, name: '李四', email: 'lisi@example.com', status: '活跃' },
  ]

  return (
    <DataTable<DataType>
      columns={columns}
      dataSource={data}
      loading={loading}
      striped
      bordered
      pagination={false}
    />
  )
}

export default UserListPage
```

## 注意事项

1. **类型安全**：组件支持 TypeScript 泛型，建议使用类型定义
2. **性能优化**：大数据量时建议使用虚拟滚动或分页加载
3. **样式覆盖**：如需自定义样式，可以通过 `className` 属性传入自定义类名
4. **UnoCSS 支持**：组件已使用 UnoCSS 进行样式处理，支持响应式布局
5. **路径别名**：使用 `@/components/DataTable` 导入，避免相对路径混乱

## 更新日志

- **v1.1.0** (2026-01-30)
  - 重命名为 DataTable，避免与 Antd Table 混淆
- **v1.0.0** (2024-01-20)
  - 初始版本
  - 支持加载状态、斑马纹、自动高度等功能
