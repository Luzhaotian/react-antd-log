# SearchBar 组件

搜索栏组件，支持多字段搜索、展开/收起、自定义渲染等功能。

## 引入方式

```tsx
import SearchBar from '@/components/SearchBar'
import type { SearchField } from '@/components/SearchBar'
```

## 基本用法

```tsx
import SearchBar from '@/components/SearchBar'
import type { SearchField } from '@/components/SearchBar'

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

function MyComponent() {
  const handleSearch = (values: Record<string, any>) => {
    console.log('搜索参数:', values)
    // 执行搜索逻辑
  }

  const handleReset = () => {
    console.log('重置搜索')
    // 执行重置逻辑
  }

  return (
    <SearchBar
      fields={searchFields}
      onSearch={handleSearch}
      onReset={handleReset}
    />
  )
}
```

## API

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| fields | 搜索字段配置 | `SearchField[]` | `[]` |
| expandable | 是否显示展开/收起 | `boolean` | `false` |
| defaultExpandCount | 默认展开字段数量 | `number` | `3` |
| onSearch | 搜索回调 | `(values: Record<string, any>) => void` | - |
| onReset | 重置回调 | `() => void` | - |
| showSearchButton | 是否显示搜索按钮 | `boolean` | `true` |
| showResetButton | 是否显示重置按钮 | `boolean` | `true` |
| extra | 自定义操作按钮 | `React.ReactNode` | - |

### SearchField 接口

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| name | 字段名 | `string` | - |
| label | 标签 | `string` | - |
| placeholder | 占位符 | `string` | - |
| required | 是否必填 | `boolean` | `false` |
| render | 自定义渲染 | `(form: FormInstance) => React.ReactNode` | - |

## 功能特性

- ✅ **多字段搜索**：支持配置多个搜索字段
- ✅ **展开/收起**：通过 `expandable` 属性启用展开/收起功能
- ✅ **自定义渲染**：通过 `render` 函数自定义字段渲染
- ✅ **响应式布局**：移动端自适应
- ✅ **表单验证**：支持必填字段验证

## 高级用法

### 展开/收起功能

```tsx
<SearchBar
  fields={searchFields}
  expandable // 启用展开/收起
  defaultExpandCount={2} // 默认显示前 2 个字段
  onSearch={handleSearch}
  onReset={handleReset}
/>
```

### 自定义字段渲染

```tsx
import { Select } from 'antd'

const searchFields: SearchField[] = [
  {
    name: 'status',
    label: '状态',
    render: (form) => (
      <Select
        placeholder="请选择状态"
        allowClear
        options={[
          { label: '活跃', value: 'active' },
          { label: '禁用', value: 'disabled' },
        ]}
      />
    ),
  },
]
```

### 自定义操作按钮

```tsx
import { Button } from 'antd'

<SearchBar
  fields={searchFields}
  onSearch={handleSearch}
  onReset={handleReset}
  extra={
    <Button type="primary" onClick={handleExport}>
      导出
    </Button>
  }
/>
```

### 完整示例

```tsx
import { useState } from 'react'
import SearchBar from '@/components/SearchBar'
import type { SearchField } from '@/components/SearchBar'

function UserListPage() {
  const [searchParams, setSearchParams] = useState<Record<string, any>>({})

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
    {
      name: 'role',
      label: '角色',
      placeholder: '请输入角色',
    },
  ]

  const handleSearch = (values: Record<string, any>) => {
    setSearchParams(values)
    // 执行搜索逻辑
  }

  const handleReset = () => {
    setSearchParams({})
  }

  return (
    <SearchBar
      fields={searchFields}
      expandable
      defaultExpandCount={2}
      onSearch={handleSearch}
      onReset={handleReset}
    />
  )
}

export default UserListPage
```

## 注意事项

1. **类型安全**：组件支持 TypeScript，建议使用类型定义
2. **响应式**：组件已做响应式处理，移动端会自动适配
3. **表单验证**：支持 Ant Design Form 的所有验证规则
4. **UnoCSS 支持**：组件已使用 UnoCSS 进行样式处理
5. **路径别名**：使用 `@/components/SearchBar` 导入，避免相对路径混乱
6. **展开/收起**：当字段数量少于 `defaultExpandCount` 时，展开/收起按钮会自动隐藏

## 更新日志

- **v1.0.0** (2024-01-20)
  - 初始版本
  - 支持多字段搜索、展开/收起、自定义渲染等功能
