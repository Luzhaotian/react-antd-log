# 项目结构（Project Structure）

本文档定义项目的目录组织、文件命名规范和模块拆分原则。当你需要新增模块、组织代码或重构结构时，参考此文档。

---

## 一、完整目录结构

```
react-antd-log/
├── public/                      # 静态资源（不经过构建处理）
│   ├── favicon.svg
│   └── .nojekyll
├── src/                         # 核心源码
│   ├── api/                     # API 请求层
│   │   ├── fund.ts              #   基金数据 API（东方财富 JSONP）
│   │   └── mortgage.ts          #   房贷利率 API
│   │
│   ├── assets/                  # 静态资源（经过构建处理）
│   │   └── images/
│   │
│   ├── components/              # 通用可复用组件（按组件名建目录）
│   │   ├── DataTable/
│   │   │   └── index.tsx
│   │   ├── ListPage/
│   │   │   └── index.tsx
│   │   ├── SearchBar/
│   │   │   └── index.tsx
│   │   ├── Pagination/
│   │   │   └── index.tsx
│   │   ├── TextButton/
│   │   │   └── index.tsx
│   │   ├── AppModal/
│   │   │   └── index.tsx
│   │   ├── AppDrawer/
│   │   │   └── index.tsx
│   │   ├── ImagePreview/
│   │   │   └── index.tsx
│   │   ├── FilePreview/
│   │   │   └── index.tsx
│   │   ├── PageDetail/
│   │   │   └── index.tsx
│   │   ├── RequireAuth/
│   │   │   └── index.tsx
│   │   ├── BeforeUnload/
│   │   │   └── index.tsx
│   │   └── PageLeaveGuard/
│   │       └── index.tsx
│   │
│   ├── config/                  # 全局配置
│   │   └── routes.ts            #   路由与标题映射逻辑
│   │
│   ├── constants/               # 常量定义（按领域拆分）
│   │   ├── api.ts               #   API 地址常量
│   │   ├── app.ts               #   应用名称等
│   │   ├── common.ts            #   通用常量
│   │   ├── fund.ts              #   基金相关常量
│   │   ├── home.ts              #   首页常量
│   │   ├── tools.ts             #   工具常量
│   │   ├── idbKeys.ts           #   IndexedDB 键名
│   │   ├── userRequirement.ts   #   用户需求常量
│   │   ├── components/          #   组件相关常量
│   │   └── layout/              #   布局常量（Logo 路径等）
│   │
│   ├── hooks/                   # 自定义 Hooks（全局共享）
│   │   ├── useDocumentTitle.ts
│   │   ├── useStableFn.ts
│   │   ├── useQrCodeManager.ts
│   │   └── useMortgageCalculatorDrawer.ts
│   │
│   ├── layout/                  # 布局组件
│   │   ├── MainLayout.tsx       #   主布局
│   │   ├── config/
│   │   │   └── menu.tsx         #   菜单生成逻辑
│   │   └── components/
│   │       ├── Breadcrumb/      #   面包屑组件
│   │       └── Logo/            #   Logo 组件
│   │
│   ├── pages/                   # 页面模块（按业务模块建目录）
│   │   ├── Fund/                #   基金模块
│   │   │   ├── index.tsx        #     主页（列表+图表）
│   │   │   └── components/      #     私有子组件
│   │   ├── Home/
│   │   │   └── index.tsx
│   │   ├── Login/
│   │   │   └── index.tsx
│   │   ├── NotFound/
│   │   │   └── index.tsx
│   │   ├── Settings/
│   │   │   ├── Basic.tsx
│   │   │   └── Advanced.tsx
│   │   ├── Test/
│   │   │   └── ...
│   │   ├── Tools/               #   工具包模块
│   │   │   ├── CodeCompress.tsx
│   │   │   ├── JsonViewer.tsx
│   │   │   ├── FileRename.tsx
│   │   │   └── QrCode.tsx
│   │   ├── User/                #   用户模块
│   │   │   ├── List.tsx
│   │   │   └── Detail.tsx
│   │   └── UserRequirement/     #   用户需求模块
│   │       └── ...
│   │
│   ├── routes/                  # 路由配置（按模块拆分）
│   │   ├── index.tsx            #   汇总所有路由
│   │   └── modules/
│   │       ├── home.tsx
│   │       ├── invest.tsx
│   │       ├── tools.tsx
│   │       ├── user.tsx
│   │       ├── userRequirement.tsx
│   │       ├── settings.tsx
│   │       ├── test.tsx
│   │       └── error.tsx
│   │
│   ├── types/                   # TypeScript 类型定义（集中管理）
│   │   ├── common.d.ts          #   通用类型
│   │   ├── routes.d.ts          #   路由扩展类型
│   │   ├── fund.d.ts            #   基金类型
│   │   ├── home.d.ts            #   首页类型
│   │   ├── tools.d.ts           #   工具类型
│   │   ├── userRequirement.d.ts
│   │   ├── components/          #   组件 Props 类型
│   │   └── layout/              #   布局类型
│   │
│   ├── utils/                   # 工具函数
│   │   ├── index.ts             #   统一导出
│   │   ├── auth.ts              #   认证工具
│   │   ├── request.ts           #   HTTP 请求封装
│   │   ├── common/              #   通用工具
│   │   │   ├── idb.ts
│   │   │   ├── storage.ts
│   │   │   └── region.ts
│   │   ├── components/          #   组件相关工具
│   │   ├── layout/              #   布局工具
│   │   └── pages/               #   页面级工具
│   │       ├── home.ts
│   │       ├── Tools/
│   │       └── UserRequirement/
│   │
│   ├── App.tsx                  # 应用根组件
│   ├── main.tsx                 # 入口文件
│   ├── index.css                # 全局 CSS（View Transitions 动画）
│   └── vite-env.d.ts            # Vite 类型声明
│
├── .github/workflows/           # CI/CD
│   └── deploy-github-pages.yml
├── .husky/                      # Git hooks
│   └── pre-commit
├── docs/                        # 项目文档
│   ├── components/              #   组件使用文档
│   └── skills-mcp/              #   MCP 和 Skills 管理文档
│
├── index.html                   # HTML 入口
├── package.json                 # 项目依赖
├── vite.config.ts               # Vite 构建配置
├── uno.config.ts                # UnoCSS 配置
├── tsconfig.json                # TypeScript 根配置
├── tsconfig.app.json            # TypeScript 应用配置
├── tsconfig.node.json           # TypeScript Node 配置
├── eslint.config.js             # ESLint 扁平配置
└── .prettierrc.json             # Prettier 配置
```

---

## 二、目录组织原则

### 2.1 核心原则

| 原则           | 说明                                                 |
| -------------- | ---------------------------------------------------- |
| **按功能分层** | `components/`、`pages/`、`hooks/`、`utils/` 各司其职 |
| **按领域拆分** | `constants/`、`types/` 内部按业务领域细化            |
| **就近组织**   | 页面私有组件/工具放在页面目录下                      |
| **扁平优先**   | 目录层级不超过 3 层，除非有充分理由                  |
| **PascalCase** | 组件名/目录名使用 PascalCase                         |

### 2.2 各目录职责

| 目录              | 职责                   | 规则                                               |
| ----------------- | ---------------------- | -------------------------------------------------- |
| `src/api/`        | API 请求定义           | 按业务模块分文件                                   |
| `src/components/` | 全局可复用组件         | 每个组件一个子目录，包含 `index.tsx`               |
| `src/config/`     | 全局配置（路由映射等） | 与构建配置区分，这里是运行时配置                   |
| `src/constants/`  | 静态常量               | 按领域分文件，避免魔数/硬编码                      |
| `src/hooks/`      | 全局可复用 Hooks       | 一个文件一个 Hook                                  |
| `src/layout/`     | 布局组件及相关         | 有子组件放 `components/`，有配置放 `config/`       |
| `src/pages/`      | 业务页面               | 按模块建目录，支持 `components/` + `utils/` 子目录 |
| `src/routes/`     | 路由配置               | 模块化到 `modules/`，汇总到 `index.tsx`            |
| `src/types/`      | 类型定义               | 按领域分文件，组件 Props 放 `components/` 子目录   |
| `src/utils/`      | 纯函数工具             | 按使用范围分 `common/`、`pages/`、`components/`    |

---

## 三、文件命名规范

| 类型       | 命名规则                | 示例                                  |
| ---------- | ----------------------- | ------------------------------------- |
| 组件文件   | PascalCase              | `DataTable/index.tsx`                 |
| Hooks 文件 | camelCase（`use` 前缀） | `useDocumentTitle.ts`                 |
| 工具文件   | camelCase               | `request.ts`, `auth.ts`               |
| 类型文件   | camelCase / kebab-case  | `routes.d.ts`, `userRequirement.d.ts` |
| 常量文件   | camelCase               | `app.ts`, `fund.ts`                   |
| 路由模块   | camelCase               | `user.tsx`, `home.tsx`                |
| 配置文件   | kebab-case / camelCase  | `vite.config.ts`, `uno.config.ts`     |

---

## 四、新增模块步骤

### 4.1 新增业务模块（如「订单管理」）

```
Step 1: 创建页面组件
  src/pages/Order/
  ├── List.tsx              # 列表页
  └── Detail.tsx            # 详情页（如有）

Step 2: 创建 API 接口（如需要）
  src/api/order.ts

Step 3: 创建路由模块
  src/routes/modules/order.tsx

Step 4: 创建类型定义（如需要）
  src/types/order.d.ts

Step 5: 创建常量（如需要）
  src/constants/order.ts

Step 6: 注册路由
  src/routes/index.tsx → import + 合并

Step 7: 创建页面私有组件/工具（如需要）
  src/pages/Order/components/
  src/pages/Order/utils/
```

### 4.2 新增通用组件

```
Step 1: 创建组件目录和文件
  src/components/NewComponent/index.tsx

Step 2: 定义 Props 类型
  src/types/components/newComponent.d.ts

Step 3: 更新组件文档
  docs/components/NewComponent.md
  .cursor/skills/project-standards/project-components-reference.md
```

### 4.3 新增全局 Hook

```
Step 1: 创建 Hook 文件
  src/hooks/useNewFeature.ts

Step 2: 如需类型，在 types/ 下添加
  src/types/hooks.d.ts（或内联在 Hook 文件中）
```

---

## 五、导入路径规范

```typescript
// ✅ 使用 @/ 别名（绝对路径）
import DataTable from '@/components/DataTable'
import { get } from '@/utils/request'
import type { UserType } from '@/types/user'

// ❌ 尽量避免相对路径导入（跨目录时）
import DataTable from '../../../components/DataTable'

// ✅ 同级/子级可用相对路径
import DetailCard from './components/DetailCard'
```

---

## 六、项目结构 Checklist

审查代码时，检查：

- [ ] 新组件在 `src/components/ComponentName/index.tsx`
- [ ] 新页面模块在 `src/pages/ModuleName/`
- [ ] 新路由在 `src/routes/modules/moduleName.tsx`
- [ ] 新类型在 `src/types/` 下按领域分文件
- [ ] 新常量在 `src/constants/` 下按领域分文件
- [ ] 新 API 在 `src/api/` 下按业务模块分文件
- [ ] 新 Hook 在 `src/hooks/` 下
- [ ] 导入路径使用 `@/` 别名
- [ ] 组件文档已同步更新
- [ ] 目录层级不超过 3 层
