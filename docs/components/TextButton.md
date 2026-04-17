# TextButton 组件

基于 Ant Design Button 的二次封装组件，统一管理 `type="text"` 的文本按钮。

## 引入方式

```tsx
import TextButton from '@/components/TextButton'
```

## 基本用法

```tsx
import TextButton from '@/components/TextButton'
import { MenuFoldOutlined } from '@ant-design/icons'

function MyComponent() {
  const handleClick = () => {
    console.log('按钮被点击')
  }

  return (
    <TextButton onClick={handleClick}>
      点击我
    </TextButton>
  )
}
```

## API

TextButton 继承自 Ant Design 的 `Button` 组件，但固定了 `type="text"`，其他属性与 `Button` 完全一致。

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| ...props | Button 的所有属性（除 type） | `ButtonProps` | - |

### 常用属性

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| icon | 按钮图标 | `ReactNode` | - |
| onClick | 点击事件 | `(e: MouseEvent) => void` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| loading | 是否加载中 | `boolean` | `false` |
| size | 按钮尺寸 | `'large' \| 'middle' \| 'small'` | `'middle'` |
| className | 自定义类名 | `string` | `''` |
| children | 按钮内容 | `ReactNode` | - |

## 功能特性

- ✅ **统一管理**：固定 `type="text"`，避免重复设置
- ✅ **完全兼容**：支持 Ant Design Button 的所有属性（除 type）
- ✅ **Ref 转发**：支持 ref 转发，可以获取 DOM 引用
- ✅ **类型安全**：完整的 TypeScript 类型支持

## 使用场景

TextButton 适用于以下场景：

1. **图标按钮**：只显示图标，不显示文字的按钮
2. **工具栏按钮**：在工具栏中使用的文本按钮
3. **菜单折叠按钮**：侧边栏折叠/展开按钮
4. **操作按钮**：表格行内的操作按钮

## 高级用法

### 带图标的按钮

```tsx
import TextButton from '@/components/TextButton'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'

function Header() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <TextButton
      icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      onClick={() => setCollapsed(!collapsed)}
      className="text-base w-16 h-16 flex items-center justify-center"
    />
  )
}
```

### 带加载状态的按钮

```tsx
import TextButton from '@/components/TextButton'

function MyComponent() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await submitData()
    } finally {
      setLoading(false)
    }
  }

  return (
    <TextButton loading={loading} onClick={handleSubmit}>
      提交
    </TextButton>
  )
}
```

### 禁用状态

```tsx
import TextButton from '@/components/TextButton'

function MyComponent() {
  const [disabled, setDisabled] = useState(false)

  return (
    <TextButton disabled={disabled} onClick={handleClick}>
      点击
    </TextButton>
  )
}
```

### 不同尺寸

```tsx
import TextButton from '@/components/TextButton'

function MyComponent() {
  return (
    <div className="flex gap-4">
      <TextButton size="large">大按钮</TextButton>
      <TextButton size="middle">中按钮</TextButton>
      <TextButton size="small">小按钮</TextButton>
    </div>
  )
}
```

### 使用 Ref

```tsx
import { useRef } from 'react'
import TextButton from '@/components/TextButton'

function MyComponent() {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleFocus = () => {
    buttonRef.current?.focus()
  }

  return (
    <>
      <TextButton ref={buttonRef}>按钮</TextButton>
      <button onClick={handleFocus}>聚焦按钮</button>
    </>
  )
}
```

### 完整示例

```tsx
import { useState } from 'react'
import TextButton from '@/components/TextButton'
import { MenuFoldOutlined, MenuUnfoldOutlined, SettingOutlined } from '@ant-design/icons'

function Header() {
  const [collapsed, setCollapsed] = useState(false)
  const [loading, setLoading] = useState(false)

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  const handleSettings = async () => {
    setLoading(true)
    // 模拟异步操作
    setTimeout(() => {
      setLoading(false)
      console.log('设置已保存')
    }, 1000)
  }

  return (
    <div className="flex items-center gap-4 px-6 h-16">
      <TextButton
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={toggleCollapsed}
        className="text-base w-16 h-16 flex items-center justify-center"
        aria-label={collapsed ? '展开菜单' : '收起菜单'}
      />
      
      <TextButton
        icon={<SettingOutlined />}
        loading={loading}
        onClick={handleSettings}
        className="ml-auto"
      >
        设置
      </TextButton>
    </div>
  )
}

export default Header
```

## 与 Ant Design Button 的区别

| 特性 | TextButton | Ant Design Button |
|------|-----------|-------------------|
| type 属性 | 固定为 `"text"` | 可配置（`primary`、`default`、`dashed`、`link`、`text`） |
| 使用场景 | 文本按钮专用 | 通用按钮 |
| 代码简洁性 | 无需设置 type | 需要设置 type |

### 对比示例

```tsx
// ❌ 使用 Ant Design Button，需要设置 type
import { Button } from 'antd'

<Button type="text" icon={<MenuFoldOutlined />} onClick={handleClick}>
  菜单
</Button>

// ✅ 使用 TextButton，更简洁
import TextButton from '@/components/TextButton'

<TextButton icon={<MenuFoldOutlined />} onClick={handleClick}>
  菜单
</TextButton>
```

## 样式自定义

### 使用 className

```tsx
import TextButton from '@/components/TextButton'

<TextButton className="text-base w-16 h-16 flex items-center justify-center">
  按钮
</TextButton>
```

### 使用 UnoCSS

```tsx
import TextButton from '@/components/TextButton'

<TextButton className="hover:bg-gray-100 transition-colors">
  按钮
</TextButton>
```

### 使用 style

```tsx
import TextButton from '@/components/TextButton'

<TextButton style={{ padding: '8px 16px', borderRadius: '4px' }}>
  按钮
</TextButton>
```

## 注意事项

1. **类型安全**：组件支持 TypeScript，建议使用类型定义
2. **路径别名**：使用 `@/components/TextButton` 导入，避免相对路径混乱
3. **type 属性**：组件固定了 `type="text"`，无法通过 props 修改
4. **Ref 转发**：组件使用 `forwardRef`，支持 ref 转发
5. **样式覆盖**：可以通过 `className` 或 `style` 属性自定义样式
6. **UnoCSS 支持**：组件已使用 UnoCSS 进行样式处理，支持响应式布局
7. **无障碍性**：建议为图标按钮添加 `aria-label` 属性

## 最佳实践

### 1. 图标按钮

对于只有图标的按钮，建议添加 `aria-label` 提升无障碍性：

```tsx
<TextButton
  icon={<MenuFoldOutlined />}
  aria-label="折叠菜单"
  onClick={handleClick}
/>
```

### 2. 工具栏按钮

在工具栏中使用时，建议统一尺寸和样式：

```tsx
<div className="flex items-center gap-2">
  <TextButton
    icon={<EditOutlined />}
    className="w-8 h-8 flex items-center justify-center"
  />
  <TextButton
    icon={<DeleteOutlined />}
    className="w-8 h-8 flex items-center justify-center"
  />
</div>
```

### 3. 表格操作按钮

在表格行内使用时，建议使用小尺寸：

```tsx
<TextButton size="small" icon={<EditOutlined />}>
  编辑
</TextButton>
```

## 更新日志

- **v1.0.0** (2024-01-20)
  - 初始版本
  - 基于 Ant Design Button 封装
  - 固定 `type="text"`
  - 支持 ref 转发
  - 完整的 TypeScript 类型支持
