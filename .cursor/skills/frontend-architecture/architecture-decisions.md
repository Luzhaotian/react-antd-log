# 架构决策（Architecture Decisions）

> 版本同步：配合 frontend-architecture / code-review 1.1.0（2026-07-19）

本文档记录项目的核心技术选型依据、架构模式和设计原则。

---

## 一、技术选型理由

| 技术                | 选型理由                                    | 替代方案（不推荐）     |
| ------------------- | ------------------------------------------- | ---------------------- |
| **React 19**        | 函数组件 + Hooks 生态成熟                   | Vue / Angular          |
| **TypeScript**      | 类型安全                                    | JavaScript             |
| **Ant Design 6**    | 企业后台 UI、中文生态                       | MUI / Arco             |
| **Vite 7**          | HMR / ESM / 构建快                          | Webpack                |
| **React Router 7**  | 数据路由、懒加载、View Transitions          | TanStack Router        |
| **UnoCSS**          | 按需原子 CSS                                | Tailwind（非必要不换） |
| **Zustand（按域）** | 仅复杂域（如 ResumeEditor）；其余用内置状态 | 全局 Redux             |

### 状态库怎么用

```
✅ useState / useReducer     → 默认
✅ localStorage / IndexedDB  → 持久化
✅ 自定义 Hooks              → 逻辑复用
✅ Zustand（按业务域）       → 已用于 ResumeEditor

❌ 简单列表页不要上全局 store
⚠️ persist：禁止每按键同步写盘；订阅用 selector
```

---

## 二、架构模式

### 2.1 Application Shell

入口唯一：`main.tsx` → ConfigProvider → RouterProvider
`/login` 独立；业务区 `RequireAuth` + `MainLayout` + `Outlet`。
已移除未使用的 `App.tsx`。

### 2.2 路由驱动

菜单 / 面包屑 / 标题均来自 `routes/modules/*` 的 `meta`。

### 2.3 组件分层

模板（ListPage/PageDetail）→ 封装（DataTable 等）→ 功能（FilePreview 等）→ 守卫 → 业务页。

### 2.4 双路由

History 默认；`VITE_HASH_ROUTER=true` 时 Hash（GitHub Pages）。

---

## 三、性能策略

### 3.1 代码分割

- 页面 `React.lazy()` + Content 层 Suspense
- 入口壳尽量薄；Login 建议懒加载
- Vite `manualChunks` 拆分 react / antd / 重 vendor（见 project-config）

### 3.2 重依赖按需加载（强制）

| 依赖族                              | 规则                                              |
| ----------------------------------- | ------------------------------------------------- |
| echarts                             | 优先 core 按需；禁止默认路由全量静态；弹窗宜 lazy |
| xlsx / pdf / mammoth / docx / jspdf | 使用点动态 import；大字体走动态/CDN               |
| html2canvas                         | 保持动态 import                                   |

### 3.3 渲染

`useMemo`/`useCallback` 仅在有收益时使用；Zustand 用 selector；避免 memo→effect→复制 state。

### 3.4 审查清单（与 code-review 对齐）

见 [../code-review/SKILL.md](../code-review/SKILL.md) 清单 A–E。

---

## 四、设计原则

单一职责 · 路由驱动 · 模板优先 · 组合优于继承 · 显式数据流 · 最小依赖 · 重依赖懒加载

## 五、禁止

相对路径跨目录导入 · any · 无谓重依赖静态导入 · 无必要全局 Redux · 魔数硬编码
