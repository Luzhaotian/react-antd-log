# ListPage 组件

列表页统一布局组件：标题、描述、标题右侧操作区、可选搜索栏、主内容区。与项目内 Fund、房贷列表等列表页风格一致。

## 引入方式

```tsx
import ListPage from '@/components/ListPage'
import type { ListPageProps } from '@/types'
```

## 基本用法

```tsx
import { Card, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import ListPage from '@/components/ListPage'
import DataTable from '@/components/DataTable'

function MyListPage() {
  return (
    <ListPage
      title="列表标题"
      description="列表说明文案"
      extra={
        <Button type="primary" icon={<PlusOutlined />}>
          新增
        </Button>
      }
    >
      <Card size="small">
        <DataTable columns={columns} dataSource={list} rowKey="id" />
      </Card>
    </ListPage>
  )
}
```

## 带搜索栏

```tsx
<ListPage
  title="用户列表"
  description="支持关键词搜索"
  extra={<Button type="primary">新增</Button>}
  searchBarProps={{
    fields: [
      { name: 'keyword', label: '关键词', placeholder: '请输入' },
    ],
    onSearch: (values) => fetchList(values),
    onReset: () => fetchList({}),
  }}
>
  <Card size="small">
    <DataTable ... />
  </Card>
</ListPage>
```

## API

| 参数             | 说明                         | 类型             | 默认值 |
| ---------------- | ---------------------------- | ---------------- | ------ |
| title            | 页面标题                     | `ReactNode`      | -      |
| description      | 标题下方描述                 | `ReactNode`      | -      |
| extra            | 标题右侧操作区               | `ReactNode`      | -      |
| searchBarProps   | 传入则渲染 SearchBar         | `SearchBarProps` | -      |
| children         | 主内容（通常 Card + DataTable） | `ReactNode`      | -      |
| className        | 根节点 className             | `string`         | `''`   |

## 使用场景

- 各类列表页（数据列表、管理列表等）
- 需要统一标题 + 描述 + 操作按钮 + 可选搜索 + 表格/卡片内容时，优先使用 ListPage 保证风格统一。
