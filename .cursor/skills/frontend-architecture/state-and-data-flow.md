# 状态管理与数据流（State & Data Flow）

> 版本同步：1.1.0（2026-07-19）

---

## 一、状态分层

```
Layer 1  持久化 / 域 Store
         localStorage、IndexedDB、Zustand(persist) 如 ResumeEditor
Layer 2  路由状态（URL / meta → 菜单面包屑标题）
Layer 3  页面状态（useState / useReducer）
Layer 4  组件状态（useState / useRef）
```

## 二、方案

### 2.1 默认：React 内置 + storage

useState / useReducer / useMemo（有收益时）/ localStorage / IndexedDB。

### 2.2 Zustand（已落地）

位置：`src/pages/ResumeEditor/store/`

- 仅限该域，不做全局 auth store
- 必须 selector 订阅
- persist 写入防抖；避免每键全量 map + 序列化

### 2.3 Hooks

`useDocumentTitle` · `useQrCodeManager` · `useMortgageCalculatorDrawer`

### 2.4 安全

- AI Key / token 生产勿长期明文 localStorage；优先后端代理或 httpOnly cookie
- `getAuthToken()` 应对接 request；当前缺口在审查中标出

## 三、API

- `src/api/fund.ts` / `mortgage.ts` + `utils/request.ts`
- 页面域服务可放 `pages/<Module>/services/`
- AiResume 与 ResumeEditor 的 aiService 重复时宜收敛

## 四、演进

默认内置 → 复杂单域 Zustand → 跨模块再评估 Context/全局 store → 不上 Redux（除非明确需求）

## 五、Checklist

- [ ] 默认 useState；复杂域才 Zustand + selector + persist 防抖
- [ ] API 三态；重库动态 import
- [ ] 不经 `@/utils` barrel 导出重型导出工具
- [ ] 敏感密钥不落明文 localStorage（生产）
