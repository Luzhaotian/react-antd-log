# 状态管理与数据流（State & Data Flow）

本文档定义项目中的状态管理方案、数据流向、API 交互模式。当你需要做状态管理决策或设计数据流时，参考此文档。

---

## 一、状态分层

```
┌──────────────────────────────────────────┐
│ Layer 1: 全局状态                         │
│ localStorage: 登录状态, token, 应用设置    │
│ IndexedDB: 大量持久化数据                  │
├──────────────────────────────────────────┤
│ Layer 2: 路由状态                         │
│ URL params, location.state, search params │
│ 路由 meta → 菜单/面包屑/标题               │
├──────────────────────────────────────────┤
│ Layer 3: 页面状态                         │
│ useState / useReducer                     │
│ 列表数据、表单值、UI 开关状态              │
├──────────────────────────────────────────┤
│ Layer 4: 组件状态                         │
│ useState / useRef                         │
│ 内部交互状态、DOM 引用                     │
└──────────────────────────────────────────┘
```

---

## 二、状态管理方案

### 2.1 当前方案：无全局状态库

| 工具           | 用途                   | 示例                      |
| -------------- | ---------------------- | ------------------------- |
| `useState`     | 页面/组件局部状态      | 列表数据、表单值、loading |
| `useReducer`   | 复杂状态逻辑           | 多字段表单、多步骤流程    |
| `useCallback`  | 稳定事件处理引用       | 传给子组件的 handler      |
| `useMemo`      | 派生数据缓存           | 过滤后的列表、菜单状态    |
| `useRef`       | 可变引用（不触发渲染） | DOM 引用、定时器 ID       |
| `localStorage` | 持久化简单数据         | 登录态、设置、基金代码    |
| `IndexedDB`    | 持久化大量数据         | 二维码数据                |

### 2.2 自定义 Hooks（逻辑复用）

项目中关键的 Hooks：

| Hook                          | 职责                   | 设计意图                  |
| ----------------------------- | ---------------------- | ------------------------- |
| `useDocumentTitle`            | 根据路由自动更新标题   | 路由驱动的副作用          |
| `useStableFn`                 | 引用稳定但调用最新回调 | 解决闭包陷阱 + 避免重渲染 |
| `useQrCodeManager`            | 二维码增删改查         | 封装 IndexedDB 操作       |
| `useMortgageCalculatorDrawer` | 房贷计算器抽屉         | 封装抽屉状态 + 表单逻辑   |

**useStableFn 模式**（闭包陷阱解决方案）：

```typescript
// 问题：useCallback 依赖 state，导致引用不稳定
const handler = useCallback(() => {
  doSomething(state) // 闭包捕获的是旧 state
}, [state]) // 每次 state 变，引用都变

// 解决：useStableFn 引用永远稳定，但执行时拿最新值
const handler = useStableFn(() => {
  doSomething(state) // 总是拿到最新 state
})
// handler 引用永不变化，适合传给 useEffect 依赖或子组件
```

### 2.3 持久化策略

```
localStorage
  ├── isLoggedIn      → 登录状态
  ├── token           → 认证令牌
  └── fundCodes       → 基金代码列表（JSON）

IndexedDB (idb-keyval)
  └── qrCodeData      → 二维码数据
```

**持久化模式**：

```typescript
// 初始化时从 localStorage 恢复
const [fundCodes, setFundCodes] = useState<string[]>(() => {
  const saved = localStorage.getItem('fundCodes')
  return saved ? JSON.parse(saved) : []
})

// 变化时自动同步回 localStorage
useEffect(() => {
  localStorage.setItem('fundCodes', JSON.stringify(fundCodes))
}, [fundCodes])
```

---

## 三、数据流向

### 3.1 整体数据流

```
┌──────────┐    ┌──────────┐    ┌───────────┐    ┌──────────┐
│  API 层   │ →  │  页面状态  │ →  │  组件 Props │ →  │  UI 渲染  │
│ src/api/  │    │ useState  │    │  向下传递   │    │          │
└──────────┘    └──────────┘    └───────────┘    └──────────┘
                     ↑                               │
                     │        用户操作回调             │
                     └───────────────────────────────┘
```

### 3.2 数据获取模式

```typescript
function MyPage() {
  const [data, setData] = useState<DataType[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async (params?: SearchParams) => {
    setLoading(true)
    setError(null)
    try {
      const result = await get<DataType[]>('/api/data', params)
      setData(result)
    } catch (e) {
      setError(e as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  return (
    <DataTable
      dataSource={data}
      loading={loading}
      // 错误态可在页面级别处理或通过 message.error 提示
    />
  )
}
```

**三态处理原则**：

- **加载态**：通过 `loading` prop 传递给 DataTable
- **空态**：DataTable 内置的 `emptyText` 属性
- **错误态**：try/catch 中通过 `message.error()` 或页面级错误展示

---

## 四、API 层设计

### 4.1 请求封装

```typescript
// utils/request.ts — 基于 fetch 的轻量封装
get<T>(url, config?)     → Promise<T>
post<T>(url, data?, config?) → Promise<T>
put<T>(url, data?, config?)  → Promise<T>
del(url, data?, config?)     → Promise<void>
```

**特点**：

- 统一解析 JSON 响应
- 统一校验 `code === 200`
- 自动设置 `Content-Type: application/json`
- 非 200 响应 throw Error

### 4.2 API 模块组织

```
src/api/
├── fund.ts          # 基金相关 API（JSONP 调用东方财富）
└── mortgage.ts      # 房贷利率 API（东方财富数据中心）

src/utils/
└── request.ts       # 通用 HTTP 请求封装
```

**原则**：

- API 定义按业务模块集中在 `src/api/` 下
- 简单请求直接用 `request.ts` 的 get/post
- 跨域 API 通过 Vite proxy 转发
- JSONP 用于不支持 CORS 的第三方 API

### 4.3 JSONP 模式（东方财富基金 API）

```typescript
// src/api/fund.ts — JSONP 通过 script 标签注入
// 全局回调变量 + 串行化 script 请求链
function jsonp<T>(url: string, callbackName: string): Promise<T> {
  return new Promise(resolve => {
    ;(window as any)[callbackName] = (data: T) => {
      resolve(data)
      document.head.removeChild(script)
    }
    const script = document.createElement('script')
    script.src = url
    document.head.appendChild(script)
  })
}
```

**注意事项**：

- 需要定义全局变量类型（`src/types/global.d.ts`）
- 多个请求需要串行化，避免回调覆盖
- 仅在跨域且无法配置 CORS/proxy 时使用

---

## 五、状态管理演进指南

当项目状态复杂度增长时，按以下优先级引入：

```
现在（当前规模）：
  useState + useCallback + localStorage → ✅ 足够

当出现以下情况时考虑引入方案：
  1. 多个不相关组件需要共享同一份状态
     → React Context + useReducer
  2. 需要中间件（日志、持久化、异步）
     → Zustand（推荐，轻量）
  3. 复杂的状态依赖和时间旅行调试
     → Redux Toolkit
```

### Zustand 引入示例（如需要）

```typescript
// stores/useAuthStore.ts
import { create } from 'zustand'

interface AuthStore {
  isLoggedIn: boolean
  login: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>(set => ({
  isLoggedIn: !!localStorage.getItem('token'),
  login: token => {
    localStorage.setItem('token', token)
    set({ isLoggedIn: true })
  },
  logout: () => {
    localStorage.removeItem('token')
    set({ isLoggedIn: false })
  },
}))
```

---

## 六、数据流 Checklist

新增页面/模块时，确保：

- [ ] 页面状态用 `useState`，复杂逻辑用 `useReducer`
- [ ] 事件处理函数用 `useCallback` 包裹（传给子组件时）
- [ ] 昂贵计算用 `useMemo` 缓存
- [ ] API 调用有 loading/error/empty 三态处理
- [ ] 持久化数据用 `localStorage`（简单）或 `IndexedDB`（大量）
- [ ] 持久化数据初始化时恢复，变化时同步写回
- [ ] 跨域 API 优先用 Vite proxy，备选 JSONP
- [ ] 避免在 useEffect 中遗漏依赖（遵循 ESLint `react-hooks/exhaustive-deps`）
