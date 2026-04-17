# BeforeUnload 组件

页面离开确认组件，当用户尝试刷新、关闭浏览器或切换路由时弹出确认框。

## 引入方式

```tsx
import BeforeUnload from '@/components/BeforeUnload'
```

## 基本用法

```tsx
import { useState } from 'react'
import BeforeUnload from '@/components/BeforeUnload'

function MyPage() {
  const [content, setContent] = useState('')

  // 当有内容时启用离开提示
  const hasUnsavedChanges = content.trim().length > 0

  return (
    <div>
      <BeforeUnload when={hasUnsavedChanges} />
      <textarea value={content} onChange={e => setContent(e.target.value)} />
    </div>
  )
}
```

## API

| 参数      | 说明              | 类型        | 默认值                         |
| ------- | --------------- | --------- | --------------------------- |
| when    | 是否启用离开提示        | `boolean` | -                           |
| message | 提示消息            | `string`  | `'您有未保存的内容，离开后将丢失，确定要离开吗？'` |
| title   | 确认框标题（仅路由切换时显示） | `string`  | `'确认离开'`                    |

## 功能特性

- ✅ **浏览器刷新/关闭**：使用 `beforeunload` 事件
- ✅ **路由切换拦截**：使用 React Router `useBlocker` 拦截菜单切换
- ✅ **Ant Design Modal**：路由切换时显示美观的确认弹窗
- ✅ **条件控制**：通过 `when` 属性动态启用/禁用
- ✅ **零渲染**：组件不渲染任何 DOM 元素
- ✅ **自动清理**：组件卸载时自动移除事件监听

## 高级用法

### 表单编辑页面

```tsx
import { useState, useCallback } from 'react'
import { Form, Input, Button } from 'antd'
import BeforeUnload from '@/components/BeforeUnload'

function EditPage() {
  const [form] = Form.useForm()
  const [isDirty, setIsDirty] = useState(false)

  const handleValuesChange = useCallback(() => {
    setIsDirty(true)
  }, [])

  const handleSubmit = useCallback(async (values: any) => {
    await saveData(values)
    setIsDirty(false) // 保存后关闭提示
  }, [])

  return (
    <div>
      <BeforeUnload when={isDirty} />
      <Form form={form} onValuesChange={handleValuesChange} onFinish={handleSubmit}>
        <Form.Item name="title" label="标题">
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit">保存</Button>
      </Form>
    </div>
  )
}
```

### 自定义提示内容

```tsx
<BeforeUnload 
  when={hasUnsavedChanges} 
  title="数据未保存"
  message="当前编辑的内容尚未保存，离开将丢失所有更改。"
/>
```

### 多条件组合

```tsx
<BeforeUnload when={hasUnsavedChanges && !isSaving} />
```

## 注意事项

1. **浏览器刷新/关闭**：现代浏览器会忽略自定义 `message`，显示默认提示文案
2. **路由切换**：会显示 Ant Design Modal，支持自定义 `title` 和 `message`
3. **用户体验**：仅在确实有未保存内容时启用，避免滥用影响用户体验
4. **移动端兼容性**：部分移动端浏览器可能不支持 `beforeunload` 或行为不一致

## 更新日志

- **v1.1.0** (2026-01-30)
  - 新增路由切换拦截（使用 `useBlocker`）
  - 新增 `title` 属性
  - 路由切换时显示 Ant Design Modal
- **v1.0.0** (2026-01-30)
  - 初始版本
  - 支持 `when` 条件控制
  - 支持浏览器刷新/关闭拦截

