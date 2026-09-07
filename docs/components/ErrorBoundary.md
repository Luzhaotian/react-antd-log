# ErrorBoundary 组件

捕获 React 子树渲染期错误，避免整页白屏；默认展示 `ErrorFallback`。

## 引入方式

```tsx
import ErrorBoundary from '@/components/ErrorBoundary'
```

## 基本用法

```tsx
<ErrorBoundary>
  <Page />
</ErrorBoundary>
```

## API

| 参数     | 说明                                            | 类型                    | 默认值             |
| -------- | ----------------------------------------------- | ----------------------- | ------------------ |
| children | 子树                                            | `ReactNode`             | —                  |
| fallback | 自定义兜底 UI，或 `(error, reset) => ReactNode` | `ReactNode \| function` | 内置 ErrorFallback |
| onError  | 捕获后回调                                      | `(error, info) => void` | —                  |

## 注意事项

- 事件处理器、异步回调内的错误不会被 ErrorBoundary 捕获，需自行 try/catch 或依赖 `setupGlobalErrorHandlers`。
- 路由级加载失败使用 React Router `errorElement`（见 `RouteErrorPage`）。

## 更新日志

- 2026-09-07：新增
