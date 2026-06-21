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
- **@dnd-kit** - 拖拽排序

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
| 投资理财   | `/invest`           | 基金监控                                      |
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
│   │   ├── Fund/         # 基金监控
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

开发环境下 `vite.config.ts` 已配置代理：

- `/api` → Java 后端 `8080`
- `/fundapi`、`/fundgz`、`/fundsuggest` 等 → 东方财富基金 API

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

## 更新日志

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
