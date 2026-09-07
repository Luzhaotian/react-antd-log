# AGENTS.md — 项目事实源（工具无关）

> **职责**：本仓库的产品定位、命令、目录、约定与部署要点。
> Cursor、Claude Code、人类开发者共用；**不写**某一 AI 工具的专属配置。
> Claude Code 请另读 [`CLAUDE.md`](./CLAUDE.md)；Cursor 规则/Skills 见 [`.cursor/`](./.cursor/)。

---

## 项目是什么

React 19 + TypeScript + Ant Design 6 中后台，Vite 7 构建；支持 History / Hash 路由，可部署 GitHub Pages。

| 项           | 说明                                                                   |
| ------------ | ---------------------------------------------------------------------- |
| 入口         | `src/main.tsx` → `/login` 或 `RequireAuth` → `MainLayout` → 懒加载页面 |
| 主题         | 主色 `#ff4d4f`，antd `zhCN`                                            |
| 鉴权（当前） | 前端 mock 登录 + localStorage token；无真实后端                        |

---

## 命令

```bash
npm run dev          # http://localhost:5173
npm run build        # tsc -b && vite build
npm run preview      # 预览 dist
npm run lint         # ESLint
npm run lint:fix     # ESLint 自动修复
npm run test         # Vitest（单次）
npm run test:watch   # Vitest 监听
npm run format       # Prettier 写入
npm run format:check # Prettier 检查
```

质量门禁：本地 Husky + lint-staged；CI 见 `.github/workflows/ci.yml`（lint → test → build）。

---

## 目录速览

```
src/
├── api/            # 请求封装（基金、房贷等）
├── components/     # 通用组件（ListPage / DataTable / ErrorBoundary …）
├── config/         # 路由→标题等配置逻辑
├── constants/      # 按领域常量（含 APP_NAME / APP_VERSION）
├── hooks/          # 全局 Hooks
├── layout/         # MainLayout、菜单、面包屑、Logo
├── pages/          # 业务页（按模块目录）
├── routes/modules/ # 路由模块（懒加载，菜单由此派生）
├── types/          # TypeScript 类型
├── utils/          # 工具（auth / request / logger …）
├── private/        # 本机私有数据（gitignore，不提交）
└── test/           # 单元测试（与源码分离；setup + utils 镜像用例）
```

**路由驱动**：菜单、面包屑、`document.title` 均来自 `routes/modules/*` 的 `meta`，勿在布局里硬编码一份。

---

## 约定（摘要）

- 路径别名只用 `@/`，禁止相对路径穿越 `src`
- 页面 `lazy()`；echarts / xlsx / pdf / mammoth / jspdf 等**禁止无谓顶层静态导入**
- 状态默认 React 内置 + storage；复杂域可用 Zustand（如 ResumeEditor）
- 列表页优先 `ListPage` + `DataTable` + `SearchBar` + `Pagination`
- Prettier：单引号、无分号、2 空格、100 列；ESLint 9 Flat + TS + Prettier
- Git commit：**仅中文、单行**（详见各工具 rules）

细节以 Skills 为准，勿在本文件展开长规范：

| 场景                      | 读                                      |
| ------------------------- | --------------------------------------- |
| 架构 / 路由 / 状态        | `.cursor/skills/frontend-architecture/` |
| Vite / TS / antd / UnoCSS | `.cursor/skills/project-config/`        |
| 代码风格与通用组件        | `.cursor/skills/project-standards/`     |
| 东方财富基金 API          | `.cursor/skills/eastmoney-fund-api/`    |
| 代码审查清单              | `.cursor/skills/code-review/`           |

索引：[`.cursor/ai-tools-catalog.md`](./.cursor/ai-tools-catalog.md)。

---

## 运行与部署要点

- **代理**（`vite.config.ts`）：`/api` → `127.0.0.1:8080`；`/fundapi`、`/fundgz`、`/fundsuggest`、`/funddata`、`/datacenter` → 东方财富相关域名
- **环境变量**：见 [`.env.example`](./.env.example)（`VITE_BASE_PATH`、`VITE_HASH_ROUTER` 等）
- **GitHub Pages**：CI 注入 `VITE_BASE_PATH` + `VITE_HASH_ROUTER=true`（Hash 避免深链 404）
- **本机私有基金快照**：`src/private/fund-portfolio/`（已 ignore）；加载逻辑 `src/pages/Fund/privateBootstrap.ts`；说明见 `README.md`

---

## 文档边界

| 文件                   | 写什么                                 | 不写什么                         |
| ---------------------- | -------------------------------------- | -------------------------------- |
| **本文件 `AGENTS.md`** | 项目事实、命令、结构、约定索引         | Cursor/Claude 权限、MCP 安装步骤 |
| **`CLAUDE.md`**        | Claude Code 如何读本仓、settings/rules | 重复粘贴架构与命令全文           |
| **`README.md`**        | 面向人类的快速开始与功能说明           | AI 行为细则                      |
| **`.cursor/skills/`**  | 可执行的深度规范（两工具共用）         | 工具账号级私有配置               |
