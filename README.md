# React + TypeScript + Ant Design 热点收集管理系统

> **本文件职责**：面向人类的快速开始、业务功能说明与部署指南。
> 项目约定与目录事实见 [`AGENTS.md`](./AGENTS.md)；Claude Code 工具入口见 [`CLAUDE.md`](./CLAUDE.md)。

使用 Vite 构建的 React + TypeScript + Ant Design 中后台，提供数据概览、基金监控、工具集、简历编辑等模块，可作为脚手架使用。当前鉴权为前端 mock（无真实后端）。

## 技术栈

### 核心

- **React** 19 · **TypeScript** 5.9 · **Ant Design** 6 · **React Router** 7
- **Zustand** — 复杂域状态（如简历编辑器）
- **Vite** 7 · **UnoCSS** — 构建与原子化样式

### 能力库

- **ECharts** — 首页 / 基金图表
- **pdfjs-dist / mammoth** — 简历导入
- **html2canvas / jspdf** — 导出 PDF
- **idb-keyval** — IndexedDB（基金持仓等）
- **@dnd-kit** — 基金列表拖拽排序

### 工程

- **ESLint** 9 Flat + **Prettier** · **Husky** + lint-staged
- **Vitest** — 单元测试
- **GitHub Actions** — CI 门禁 + Pages 部署 · **Dependabot** — 依赖周更

## 快速开始

### 环境要求

- Node.js >= 20.19.0 或 >= 22.12.0
- npm >= 10.0.0

### 安装与运行

```bash
npm install
npm run dev          # http://localhost:5173（默认不自动开浏览器）
```

可选：复制 [`.env.example`](./.env.example) 为 `.env.local` 后按需修改（勿提交密钥）。

### 常用命令

```bash
npm run build        # tsc -b && vite build → dist/
npm run preview      # 预览生产构建
npm run lint         # ESLint
npm run lint:fix     # ESLint 自动修复
npm run test         # Vitest 单次
npm run test:watch   # Vitest 监听
npm run format       # Prettier 写入
npm run format:check # Prettier 检查
```

质量门禁：提交前 Husky + lint-staged；PR/推送走 `.github/workflows/ci.yml`（lint → test → build）。

## 业务模块

| 模块       | 路由前缀            | 说明                                          |
| ---------- | ------------------- | --------------------------------------------- |
| 首页       | `/`                 | 数据概览仪表盘                                |
| 投资理财   | `/invest`           | 基金监控（实时估值、持仓、组合统计）          |
| 工具包     | `/tools`            | 代码压缩、JSON 查看器、文件重命名、二维码管理 |
| 用户管理   | `/user`             | 用户列表与详情（演示）                        |
| 用户需求   | `/user-requirement` | 车贷/房贷计算器、还款追踪                     |
| 设置       | `/settings`         | 基础设置（含运行版本信息）                    |
| AI 简历    | `/ai-resume`        | 已重定向至 `/resume-editor/*`（兼容旧书签）   |
| 简历编辑器 | `/resume-editor`    | 可视化简历编辑与导入导出                      |
| 测试页     | `/test`             | UI 原型与演示页面                             |

## 简历编辑器

路由：`/resume-editor`

基于 Zustand 持久化的可视化简历模块：模板选择、分模块编辑、预览与多格式导出。

### 页面

- **模板中心** (`/resume-editor/templates`) — 选用模板创建新简历
- **我的简历** (`/resume-editor/list`) — 新建 / 编辑 / 删除 / 导出
- **编辑工作台** (`/resume-editor/workbench/:id`) — 分模块编辑

### 功能

- 分模块：基本信息、教育、工作、项目、技能、自我评价
- 模板切换与预览；导出 JSON / Markdown
- 导入：JSON、PDF、Word (.docx)、Markdown、TXT
- AI 解析：OpenAI / DeepSeek / 自定义兼容接口，从非结构化文本提取字段

### 目录结构

```
src/pages/ResumeEditor/
├── TemplateCenter.tsx
├── ResumeList.tsx
├── Workbench.tsx
├── components/
├── services/
│   ├── aiService.ts
│   └── fileParser.ts
├── store/index.ts
├── templates/index.ts
├── utils/export.ts
└── types.ts
```

### AI 配置

非 JSON 导入前需在「AI 配置」中填写 API Key（`src/utils/aiConfig.ts`）：

- 偏好（provider、baseUrl、model）→ `localStorage`
- API Key → `sessionStorage`（关标签即清，降低泄露风险）

旧键 `ai-resume-config` 会在首次读取时迁移。

## 基金监控

路由：`/invest/fund`

基于东方财富基金 API 的监控面板：多基金列表、持仓与组合分析。

### 功能

- **实时估值**：交易时段优先 `fundgz`；不可用时回退 `FundMNFInfo`
- **组合统计**：总市值、昨日涨跌、持仓盈亏、涨跌幅极值等
- **持仓管理**：份额、成本、分组、备注（IndexedDB）
- **拖拽排序**：`@dnd-kit`
- **详情 / 走势**：季报重仓、经理信息；累计收益 / 净值图表（ECharts）
- **自动刷新**：可选 30 秒定时刷新

未配置本机私有数据时，默认监控列表见 `src/constants/fund.ts` 的 `DEFAULT_FUND_CODES`。

### 本机私有持仓快照（可选）

可在本机创建 `src/private/fund-portfolio/`（**已 gitignore，不会提交**）：

```
src/private/fund-portfolio/
├── data.ts
├── bootstrap.ts
└── types.ts
```

- 存在私有目录：按快照顺序加载，并推算写入持仓
- 删除后：回退 `DEFAULT_FUND_CODES` 与 IDB 手动持仓

加载逻辑：`src/pages/Fund/privateBootstrap.ts`。

详情弹窗「持仓明细」是**基金季报股票重仓**（东方财富 `FundMNInverstPosition`），与「我的持仓」无关。

### 目录结构

```
src/pages/Fund/
├── index.tsx
├── privateBootstrap.ts
└── components/
    ├── FundTable.tsx
    ├── FundSearch.tsx
    ├── StatisticsCards.tsx
    ├── FundHoldingDrawer.tsx
    ├── FundDetailModal.tsx
    └── ChartModal.tsx
```

API：`src/api/fund.ts`（开发走 Vite 代理，生产 JSONP/script 直连）。

## 项目结构

```
react-antd-log/
├── docs/                 # 组件文档、Skills/MCP 说明
├── public/
├── src/
│   ├── api/
│   ├── components/       # ListPage、DataTable、ErrorBoundary 等
│   ├── config/
│   ├── constants/
│   ├── hooks/
│   ├── layout/
│   ├── pages/
│   ├── private/          # 本机私有数据（gitignore）
│   ├── routes/modules/   # 路由模块（菜单由此派生）
│   ├── test/             # 单元测试（setup + 按 utils 镜像组织，不与源码混放）
│   ├── types/
│   └── utils/            # auth、request、logger 等
├── .github/
│   ├── workflows/        # ci.yml、deploy-github-pages.yml
│   └── dependabot.yml
├── .cursor/              # Cursor rules / skills
├── .claude/              # Claude Code settings / rules
├── .env.example
├── AGENTS.md             # 项目事实源（工具无关）
├── CLAUDE.md             # Claude Code 专用入口
└── vite.config.ts
```

入口：`src/main.tsx` → `/login` 或 `RequireAuth` → `MainLayout` → 懒加载页面（无 `App.tsx`）。

菜单、面包屑、标题均由路由 `meta` 驱动。

## 功能特性

### 应用

- React 19 + TypeScript + Ant Design 6
- 模块化懒加载路由；菜单 / 面包屑自动生成
- View Transitions；Hash / History（Pages 用 Hash）
- ErrorBoundary + 路由 `errorElement`；前端 logger（无后端上报）

### 工程

- Vite HMR；路径别名 `@/`
- ESLint + Prettier；Husky 预提交
- Vitest 单测；CI lint / test / build
- UnoCSS；构建 `manualChunks`（react / antd / echarts / docs）

### 公共组件（节选）

- **ListPage / PageDetail** — 列表 / 详情页模板
- **DataTable / SearchBar / Pagination** — 表格组合
- **ErrorBoundary / ErrorFallback** — 渲染错误兜底
- **TextButton / AppModal / AppDrawer / FilePreview / ImagePreview / PageLeaveGuard**

完整说明见 [组件使用文档](./docs/components-usage.md) 与 [`docs/components/`](./docs/components/)。

## 路径别名

```tsx
// ❌ 不推荐
import DataTable from '../../components/DataTable'

// ✅ 推荐
import DataTable from '@/components/DataTable'
```

配置：`vite.config.ts`（`resolve.alias`）与 `tsconfig.app.json`（`paths`）。

## 代码规范

- **ESLint** 9 Flat：TypeScript + React Hooks + Prettier
- **Prettier**：单引号、无分号、2 空格、100 列
- **Git**：Husky → lint-staged；commit message **仅中文、单行**（例：`feat: 新增简历编辑器模块`）

更细约定见 [`AGENTS.md`](./AGENTS.md) 与 `.cursor/skills/project-standards/`。

## 开发指南

### 添加新页面

1. 在 `src/pages` 创建页面
2. 在 `src/routes/modules/` 注册路由（或新建模块并在 `routes/index.tsx` 汇总）
3. 菜单与面包屑按 `meta` 自动生成

### API 代理（开发）

| 路径前缀       | 目标                                        |
| -------------- | ------------------------------------------- |
| `/api`         | Java 后端 `http://127.0.0.1:8080`（预留）   |
| `/fundapi`     | `https://fundmobapi.eastmoney.com`          |
| `/fundgz`      | `https://fundgz.1234567.com.cn`（实时估值） |
| `/fundsuggest` | `https://fundsuggest.eastmoney.com`         |
| `/funddata`    | `https://fund.eastmoney.com`                |
| `/datacenter`  | 东方财富数据中心                            |

生产（GitHub Pages）无开发代理，基金 API 走 JSONP/script。详见 `src/api/fund.ts`、`src/constants/api.ts`。

### 路由模块示例

```tsx
// src/routes/modules/example.tsx
import { lazy } from 'react'
import { ExampleOutlined } from '@ant-design/icons'
import type { ExtendedRouteObject } from '@/types'

const ExamplePage = lazy(() => import('@/pages/Example'))

const exampleRoutes: ExtendedRouteObject[] = [
  {
    path: '/example',
    icon: <ExampleOutlined />,
    meta: { name: '示例模块' },
    children: [
      {
        path: 'list',
        element: <ExamplePage />,
        meta: { name: '示例列表' },
      },
    ],
  },
]

export default exampleRoutes
```

## 部署

### CI

- **质量**：`.github/workflows/ci.yml` — lint → test → build
- **依赖**：`.github/dependabot.yml` — npm / Actions 定期 PR

### GitHub Pages

推送 `main` 触发 `.github/workflows/deploy-github-pages.yml`。构建注入：

| 变量               | 说明                               |
| ------------------ | ---------------------------------- |
| `VITE_BASE_PATH`   | 子路径，如 `/react-antd-log/`      |
| `VITE_HASH_ROUTER` | `true` 启用 Hash，避免深链文档 404 |

访问示例：`https://<user>.github.io/<repo>/#/invest/fund`

本地模拟：

```bash
VITE_BASE_PATH=/react-antd-log/ VITE_HASH_ROUTER=true npm run build
npm run preview
```

环境变量说明见 [`.env.example`](./.env.example)。

## AI 辅助开发

项目事实只维护一份；工具配置各自独立：

| 文档                                                         | 给谁看           | 写什么                                          |
| ------------------------------------------------------------ | ---------------- | ----------------------------------------------- |
| [AGENTS.md](./AGENTS.md)                                     | 所有人 / 所有 AI | 命令、结构、约定索引（**事实源**）              |
| [CLAUDE.md](./CLAUDE.md)                                     | Claude Code      | 读仓顺序、settings / rules（**不重复** AGENTS） |
| [README.md](./README.md)（本文件）                           | 人类             | 安装、业务功能、部署                            |
| [.cursor/ai-tools-catalog.md](./.cursor/ai-tools-catalog.md) | Cursor           | Skills / Rules / Hooks 索引                     |
| `docs/skills-mcp/`                                           | 本机安装         | MCP 与全局 Skills 清单                          |

| 工具        | 规则                                       | Skills                     |
| ----------- | ------------------------------------------ | -------------------------- |
| Cursor      | `.cursor/rules/`                           | `.cursor/skills/`          |
| Claude Code | `.claude/rules/`、`.claude/settings*.json` | **共用** `.cursor/skills/` |

项目级 Skills：前端架构、项目配置、项目规范、东方财富基金 API、代码审查。

## 浏览器支持

Chrome / Firefox / Safari / Edge 最新稳定版。

## 相关文档

- [AGENTS.md](./AGENTS.md) — 项目事实源
- [CLAUDE.md](./CLAUDE.md) — Claude Code 入口
- [组件使用文档](./docs/components-usage.md)
- [ErrorBoundary](./docs/components/ErrorBoundary.md) · [DataTable](./docs/components/DataTable.md) · [ListPage](./docs/components/ListPage.md)
- [.cursor/ai-tools-catalog.md](./.cursor/ai-tools-catalog.md)
- [.cursor/skills/eastmoney-fund-api/SKILL.md](./.cursor/skills/eastmoney-fund-api/SKILL.md)
- [docs/skills-mcp/技能安装建议清单.md](./docs/skills-mcp/技能安装建议清单.md)
- [docs/skills-mcp/MCP安装与配置清单.md](./docs/skills-mcp/MCP安装与配置清单.md)
- [CHANGELOG.md](./CHANGELOG.md)

## 许可证

MIT
