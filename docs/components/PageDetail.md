# PageDetail 组件

详情页/内容页统一布局组件，提供标题、描述、返回按钮与操作区，统一项目详情类页面的结构层级。

## 引入方式

```tsx
import PageDetail from '@/components/PageDetail'
import type { PageDetailProps } from '@/components/PageDetail'
```

## 基本用法

```tsx
<PageDetail title="页面标题" description="页面简要说明">
  <Card>正文内容</Card>
</PageDetail>
```

## 带返回按钮（如从列表进入详情）

```tsx
<PageDetail title="用户详情 - 张三" backTo="/user/list">
  <Card>
    <Descriptions>...</Descriptions>
  </Card>
</PageDetail>
```

## 带右侧操作区

```tsx
<PageDetail
  title="编辑配置"
  description="修改后请保存"
  extra={
    <Button type="primary" onClick={handleSave}>
      保存
    </Button>
  }
>
  <Card>...</Card>
</PageDetail>
```

## API

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| title | 页面标题 | `ReactNode` | - |
| description | 标题下方的描述（次要说明） | `ReactNode` | - |
| backTo | 返回目标路径，设置后显示「返回」按钮 | `string` | - |
| onBack | 自定义返回回调，与 backTo 二选一 | `() => void` | - |
| extra | 标题右侧操作区 | `ReactNode` | - |
| children | 子内容 | `ReactNode` | - |
| contentClassName | 内容区域 className | `string` | `''` |

## 功能特性

- 统一详情页/设置页/工具页的标题与描述层级（Title level 4 + 次要描述）
- 可选「返回」按钮，支持 `backTo` 路径或 `onBack` 自定义回调，与路由 `viewTransition` 一致
- 标题右侧 `extra` 区域可放主操作按钮
- 内容区仅包裹 children，是否使用 Card 由业务自行决定

## 使用场景

- 用户详情、设置子页、工具包下的单页（如代码压缩、文件重命名、JSON 查看器）
- 任何需要「标题 + 描述 + 可选返回 + 正文」结构的页面

## 更新日志

- **v1.0.0**
  - 初始版本
  - 支持 title、description、backTo/onBack、extra、contentClassName
