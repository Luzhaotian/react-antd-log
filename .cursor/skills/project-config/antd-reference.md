# Ant Design Configuration

## Overview

This project uses **Ant Design 6.2.1** with default theme. No custom theme configuration is currently set up.

## Import Pattern

### CSS Reset

Always import Ant Design's reset CSS first in `main.tsx`:

```typescript
import 'antd/dist/reset.css'
```

### Component Imports

Import components directly from `antd`:

```typescript
// ✅ Good - Direct imports
import { Button, Table, Form } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'

// ❌ Bad - Don't import entire library
import * as antd from 'antd'
```

## Theme Usage

### Using Theme Tokens

Access theme tokens via `theme.useToken()`:

```tsx
import { theme } from 'antd'

function MyComponent() {
  const {
    token: { colorBgContainer, borderRadiusLG, colorPrimary },
  } = theme.useToken()

  return (
    <div
      style={{
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
        borderColor: colorPrimary,
      }}
    >
      Content
    </div>
  )
}
```

### Common Theme Tokens

- `colorBgContainer` - Container background color
- `colorPrimary` - Primary brand color
- `borderRadiusLG` - Large border radius
- `colorText` - Default text color
- `colorBorder` - Border color

## Component Patterns

### Layout Components

```tsx
import { Layout, Menu, theme } from 'antd'

const { Header, Sider, Content } = Layout

// Use theme tokens for consistent styling
const {
  token: { colorBgContainer, borderRadiusLG },
} = theme.useToken()
```

### Form Components

```tsx
import { Form, Input, Button } from 'antd'

// Use Form.Item for proper layout
;<Form.Item name="username" label="Username">
  <Input />
</Form.Item>
```

### Table Components

```tsx
import { Table } from 'antd'

// Use dataSource and columns pattern
;<Table dataSource={data} columns={columns} loading={loading} pagination={pagination} />
```

## Best Practices

### ✅ DO

- Use theme tokens for colors and spacing
- Import icons from `@ant-design/icons`
- Use Ant Design's built-in components instead of custom implementations
- Follow Ant Design's design patterns and API

### ❌ DON'T

- Don't override Ant Design styles with custom CSS (use theme tokens instead)
- Don't mix Ant Design components with custom styled components unnecessarily
- Don't import entire icon library - import only needed icons

## Customization

### Future Theme Customization

If theme customization is needed, configure in `main.tsx`:

```tsx
import { ConfigProvider } from 'antd'

;<ConfigProvider
  theme={{
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 6,
    },
  }}
>
  <App />
</ConfigProvider>
```

Currently, the project uses default Ant Design theme.

## Examples

### Using Theme in Layout

```tsx
import { Layout, theme } from 'antd'

function MainLayout() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  return (
    <Layout>
      <Content
        style={{
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        Content
      </Content>
    </Layout>
  )
}
```

### Using Icons

```tsx
import { ReloadOutlined, MenuFoldOutlined } from '@ant-design/icons'
import { Button } from 'antd'

;<Button icon={<ReloadOutlined />}>Refresh</Button>
```
