# React + TypeScript + Ant Design 热点收集管理系统

这是一个使用 Vite 构建的现代化 React + TypeScript + Ant Design 后台管理系统，提供数据概览、基金监控、工具集、简历编辑等模块，可作为中后台项目的基础脚手架。

## 技术栈

### 核心框架

- **React** 19.2.0 - UI 框架
- **TypeScript** 5.9.3 - 类型系统
- **Ant Design** 6.2.1 - UI 组件库
- **React Router** 7.12.0 - 路由管理
- **Zustand** 5.x - 轻量状态管理（简历编辑器等模块）

### 构建工具

- **Vite** 7.2.4 - 快速构建工具
- **UnoCSS** 66.6.0 - 原子化 CSS 引擎

### 常用库

- **ECharts** - 图表可视化（首页、基金监控）
- **pdfjs-dist / mammoth** - PDF、Word 文件解析（简历导入）
- **html2canvas / jspdf** - 简历导出与 PDF 生成
- **idb-keyval** - IndexedDB 封装（基金持仓等本地持久化）
- **@dnd-kit** - 拖拽排序（基金列表）

### 开发工具

- **ESLint** 9.39.1 - 代码检查
- **Prettier** 3.8.0 - 代码格式化
- **Husky + lint-staged** - Git 提交前自动检查

## 快速开始

### 环境要求

- Node.js >= 20.19.0 或 >= 22.12.0
- npm >= 10.0.0

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

开发服务器将在 `http://localhost:5173` 启动，并自动在浏览器中打开。

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

### 预览生产构建

```bash
npm run preview
```

### 代码检查

```bash
# 检查代码
npm run lint

# 自动修复可修复的问题
npm run lint:fix
```

### 代码格式化

```bash
# 格式化代码
npm run format

# 检查代码格式
npm run format:check
```

## 业务模块

| 模块       | 路由前缀            | 说明                                          |
| ---------- | ------------------- | --------------------------------------------- |
| 首页       | `/home`             | 数据概览仪表盘                                |
| 投资理财   | `/invest`           | 基金监控（实时估值、持仓、组合统计）          |
| 工具包     | `/tools`            | 代码压缩、JSON 查看器、文件重命名、二维码管理 |
| 用户管理   | `/user`             | 用户列表与详情                                |
| 用户需求   | `/user-requirement` | 车贷/房贷计算器、还款追踪                     |
| 设置       | `/settings`         | 基础与高级设置                                |
| AI 简历    | `/ai-resume`        | AI 辅助简历生成                               |
| 简历编辑器 | `/resume-editor`    | 可视化简历编辑与导入导出                      |
| 测试页     | `/test`             | UI 原型与演示页面                             |

## 简历编辑器

路由：`/resume-editor`

基于 Zustand 持久化存储的可视化简历编辑模块，支持模板选择、分模块编辑、预览与多格式导出。

### 页面

- **模板中心** (`/resume-editor/templates`) - 浏览并选用简历模板创建新简历
- **我的简历** (`/resume-editor/list`) - 管理已有简历，支持新建、编辑、删除、导出
- **编辑工作台** (`/resume-editor/workbench/:id`) - 分模块编辑简历内容

### 功能

- 分模块编辑：基本信息、教育经历、工作经历、项目经历、技能、自我评价
- 模板切换与实时预览
- 导出 JSON / Markdown
- 文件导入：支持 JSON、PDF、Word (.docx)、Markdown、TXT
- AI 解析：配置 OpenAI / DeepSeek / 自定义兼容接口，自动从非结构化文本提取简历字段

### 目录结构

```
src/pages/ResumeEditor/
├── TemplateCenter.tsx    # 模板中心
├── ResumeList.tsx        # 我的简历
├── Workbench.tsx         # 编辑工作台
├── components/           # 表单、预览、上传等组件
├── services/
│   ├── aiService.ts      # AI 解析服务
│   └── fileParser.ts     # 文件解析（PDF/Word/JSON 等）
├── store/index.ts        # Zustand 状态（localStorage 持久化）
├── templates/index.ts    # 简历模板定义
├── utils/export.ts       # 导出工具
└── types.ts              # 类型定义
```

### AI 配置

导入非 JSON 格式文件时，需先在「AI 配置」中填写 API Key。配置保存在浏览器 `localStorage`（键名：`ai-resume-config`），支持：

- OpenAI
- DeepSeek
- 自定义 OpenAI 兼容接口

## 基金监控

路由：`/invest/fund`

基于东方财富基金 API 的实时监控面板，支持多基金列表、持仓管理与组合分析。

### 功能

- **实时估值**：交易时段展示估算净值、涨跌幅；非交易时段展示最新净值
- **组合统计**：总市值、昨日涨跌、持仓盈亏、涨跌幅极值等汇总卡片
- **持仓管理**：份额、成本价、分组、备注录入（IndexedDB 持久化）
- **组合指标**：市值、成本、昨日涨跌、估算偏差、持仓盈亏（表格列）
- **拖拽排序**：`@dnd-kit` 调整监控列表顺序
- **详情弹窗**：基本信息、收益率、季报持仓明细（股票重仓）、基金经理
- **走势图表**：累计收益率 / 单位净值 / 累计净值（ECharts）
- **自动刷新**：可开启 30 秒定时刷新
- **名称省略**：基金名称列超长自动 `...`，悬停显示完整名称

### 默认基金列表

未配置本机私有数据时，默认监控 11 只基金（见 `src/constants/fund.ts` 中 `DEFAULT_FUND_CODES`）。

### 本机私有持仓快照（可选）

可在本机创建 `src/private/fund-portfolio/` 目录，导入支付宝截图整理的持仓数据。**该目录已加入 `.gitignore`，不会提交到 GitHub。**

```
src/private/fund-portfolio/
├── data.ts       # 截图识别的市值、收益、基金顺序
├── bootstrap.ts  # 根据实时净值反推份额/成本
└── types.ts
```

- 存在私有目录时：基金列表按截图顺序排列，刷新后自动推算并写入持仓
- 删除私有目录后：自动回退到 `DEFAULT_FUND_CODES` 与 IDB 中手动录入的持仓

相关逻辑：`src/pages/Fund/privateBootstrap.ts`

### 数据来源说明

详情弹窗「持仓明细」展示的是**基金季报披露的股票重仓**（如贵州茅台、五粮液），截止日期为季报期末日（如 `2026-03-31` 表示 Q1 季报），数据来自东方财富 `FundMNInverstPosition` 接口，与「我的持仓」无关。

### 目录结构

```
src/pages/Fund/
├── index.tsx              # 主页面（刷新、自动刷新、组合汇总）
├── privateBootstrap.ts    # 本机私有快照加载与回退
└── components/
    ├── FundTable.tsx      # 监控表格（拖拽、省略名称）
    ├── FundSearch.tsx     # 搜索添加 / 标签管理
    ├── StatisticsCards.tsx
    ├── FundHoldingDrawer.tsx
    ├── FundDetailModal.tsx
    └── ChartModal.tsx
```

API 封装：`src/api/fund.ts`（开发环境走 Vite 代理，生产环境 JSONP/script 直连）

## 项目结构

```
react-antd-log/
├── docs/                 # 组件文档
├── public/               # 静态资源
├── src/
│   ├── api/              # API 请求封装
│   ├── components/       # 公共组件（DataTable、SearchBar、Pagination 等）
│   ├── config/           # 配置文件
│   ├── constants/        # 常量定义
│   ├── hooks/            # 自定义 Hooks
│   ├── layout/           # 主布局、菜单、面包屑
│   ├── pages/            # 页面组件
│   │   ├── Home/         # 首页仪表盘
│   │   ├── Fund/         # 基金监控（含 privateBootstrap）
│   │   ├── private/      # 本机私有数据（gitignore，不提交）
│   │   ├── Tools/        # 工具包
│   │   ├── User/         # 用户管理
│   │   ├── UserRequirement/  # 贷款计算器等
│   │   ├── AiResume/     # AI 简历
│   │   ├── ResumeEditor/ # 简历编辑器
│   │   ├── Settings/     # 设置
│   │   ├── Login/        # 登录
│   │   └── NotFound/     # 404
│   ├── routes/
│   │   ├── index.tsx     # 路由汇总
│   │   └── modules/      # 按功能拆分的路由模块
│   ├── types/            # 全局类型
│   └── utils/            # 工具函数
├── eslint.config.js      # ESLint Flat Config
├── uno.config.ts         # UnoCSS 配置
└── vite.config.ts        # Vite 配置（含 API 代理）
```

## 功能特性

### 核心功能

- ✅ **React 19** - 最新版本，支持并发特性
- ✅ **TypeScript** - 完整类型支持
- ✅ **Ant Design 6** - 企业级 UI 组件库
- ✅ **模块化路由** - 按功能拆分，支持懒加载
- ✅ **多层菜单与面包屑** - 自动生成导航
- ✅ **View Transitions API** - 页面过渡动画
- ✅ **Hash / History 路由** - 支持 GitHub Pages 部署

### 开发体验

- ✅ **Vite HMR** - 极速开发反馈
- ✅ **路径别名 `@/`** - 统一引用 `src` 目录
- ✅ **ESLint + Prettier** - 代码规范与格式化
- ✅ **Husky 预提交检查** - 提交前自动 lint / format
- ✅ **UnoCSS** - 原子化 CSS

### 公共组件

- ✅ **DataTable** - 数据表格（加载状态、斑马纹、自动高度）
- ✅ **SearchBar** - 搜索栏（多字段、展开/收起）
- ✅ **Pagination** - 分页（快速跳转、每页条数）
- ✅ **TextButton** - 文本按钮

## 路径别名

项目配置了路径别名，使用 `@/` 指向 `src` 目录：

```tsx
// ❌ 不推荐
import DataTable from '../../components/DataTable'

// ✅ 推荐
import DataTable from '@/components/DataTable'
```

配置位置：`vite.config.ts`（`resolve.alias`）与 `tsconfig.app.json`（`paths`）。

## 代码规范

### ESLint

使用 ESLint 9 Flat Config，集成 TypeScript ESLint、React Hooks 规则与 Prettier。

### Prettier

- 单引号、无分号、2 空格缩进、100 字符行宽

### Git 提交

- 提交前由 Husky 触发 `lint-staged` 与 `git diff --check`
- Commit message 使用中文，格式示例：`feat: 新增简历编辑器模块`

## 开发指南

### 添加新页面

1. 在 `src/pages` 下创建页面组件
2. 在 `src/routes/modules/` 对应模块中添加路由（或新建模块文件）
3. 在 `src/routes/index.tsx` 中导入并注册
4. 菜单与面包屑会根据路由 `meta` 自动生成

### 使用公共组件

参考 [组件使用文档](./docs/components-usage.md)。

### API 代理

**开发环境**下 `vite.config.ts` 已配置代理：

| 路径前缀       | 目标                                        |
| -------------- | ------------------------------------------- |
| `/api`         | Java 后端 `http://127.0.0.1:8080`           |
| `/fundapi`     | `https://fundmobapi.eastmoney.com`          |
| `/fundgz`      | `https://fundgz.1234567.com.cn`（实时估值） |
| `/fundsuggest` | `https://fundsuggest.eastmoney.com`         |
| `/funddata`    | `https://fund.eastmoney.com`                |
| `/datacenter`  | 东方财富数据中心                            |

**生产环境**（GitHub Pages）无开发代理，基金 API 通过 JSONP / script 标签直连，避免 CORS 限制。详见 `src/api/fund.ts` 与 `src/constants/api.ts`。

## 部署

### GitHub Pages

项目通过 GitHub Actions 自动部署（`.github/workflows/deploy-github-pages.yml`），推送到 `main` 分支即触发构建。

构建时注入环境变量：

| 变量               | 说明                                     |
| ------------------ | ---------------------------------------- |
| `VITE_BASE_PATH`   | 子路径前缀，如 `/react-antd-log/`        |
| `VITE_HASH_ROUTER` | 设为 `true` 启用 Hash 路由，避免深链 404 |

访问地址：`https://<user>.github.io/<repo>/#/invest/fund`

本地模拟 Pages 构建：

```bash
VITE_BASE_PATH=/react-antd-log/ VITE_HASH_ROUTER=true npm run build
npm run preview
```

## 路由配置

路由模块位于 `src/routes/modules/`，支持：

- `meta.name` - 菜单与标题名称
- `meta.hideInMenu` - 隐藏菜单项
- `icon` - 菜单图标
- `children` - 嵌套子路由

### 添加新路由模块示例

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

```tsx
// src/routes/index.tsx
import exampleRoutes from './modules/example'

export const routes = [...homeRoutes, ...exampleRoutes, ...errorRoutes]
```

## 浏览器支持

- Chrome（最新版本）
- Firefox（最新版本）
- Safari（最新版本）
- Edge（最新版本）

## 相关文档

- [组件使用文档](./docs/components-usage.md)
- [DataTable 组件文档](./docs/components/DataTable.md)
- [SearchBar 组件文档](./docs/components/SearchBar.md)
- [Pagination 组件文档](./docs/components/Pagination.md)
- [AGENTS.md](./AGENTS.md) - 项目架构与开发约定
- [.cursor/skills/eastmoney-fund-api/SKILL.md](./.cursor/skills/eastmoney-fund-api/SKILL.md) - 东方财富基金 API 说明

## 更新日志

### v1.3.0 (2026-07-12)

- ✅ 基金监控升级：持仓录入、组合统计、昨日涨跌、估算偏差、拖拽排序
- ✅ 基金详情弹窗：季报持仓明细、基金经理、收益率
- ✅ 本机私有持仓快照（`src/private/fund-portfolio/`，gitignore）
- ✅ GitHub Pages：Hash 路由 + JSONP 直连，修复深链 404 与生产 CORS
- ✅ 基金名称列省略显示 + 悬停 Tooltip

### v1.2.0 (2026-06-21)

- ✅ 新增简历编辑器模块（模板中心、我的简历、编辑工作台）
- ✅ 支持 JSON / PDF / Word / Markdown / TXT 文件导入
- ✅ 集成 AI 解析（OpenAI、DeepSeek、自定义兼容接口）
- ✅ 简历数据 Zustand 持久化存储
- ✅ 导出 JSON / Markdown

### v1.1.0 (2026-01-30)

- ✅ 路由模块化重构
- ✅ View Transitions API 页面过渡动画
- ✅ 新增基金监控、代码压缩工具
- ✅ 移除 framer-motion，使用原生浏览器动画

### v1.0.0 (2024-01-20)

- ✅ 初始版本：React 19 + TypeScript + Ant Design 基础架构
- ✅ 路由管理、多层菜单、公共组件封装
- ✅ ESLint + Prettier 代码规范

## 许可证

MIT
