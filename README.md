# React + TypeScript + Ant Design 热点收集管理系统

这是一个使用 Vite 构建的现代化 React + TypeScript + Ant Design 项目，提供了完整的后台管理系统基础架构。

## 技术栈

### 核心框架
- **React** 19.2.0 - UI 框架
- **TypeScript** 5.9.3 - 类型系统
- **Ant Design** 6.2.1 - UI 组件库
- **React Router** 7.12.0 - 路由管理

### 构建工具
- **Vite** 7.2.4 - 快速构建工具
- **UnoCSS** 66.6.0 - 原子化 CSS 引擎

### 开发工具
- **ESLint** 9.39.1 - 代码检查工具
- **Prettier** 3.8.0 - 代码格式化工具
- **TypeScript ESLint** 8.46.4 - TypeScript 代码检查

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

## 项目结构

```
react-antd-log/
├── .vscode/              # VS Code 配置
│   └── settings.json    # 编辑器设置（保存时自动格式化）
├── docs/                 # 文档目录
│   ├── components/       # 组件文档
│   │   ├── DataTable.md
│   │   ├── SearchBar.md
│   │   └── Pagination.md
│   └── components-usage.md
├── public/               # 静态资源
├── src/
│   ├── assets/           # 资源文件（图片、字体等）
│   ├── components/       # 公共组件
│   │   ├── DataTable/    # 数据表格组件
│   │   ├── SearchBar/    # 搜索栏组件
│   │   ├── Pagination/   # 分页组件
│   │   └── TextButton/   # 文本按钮组件
│   ├── config/           # 配置文件
│   │   └── routes.ts     # 路由配置工具
│   ├── hooks/            # 自定义 Hooks
│   │   └── useDocumentTitle.ts  # 文档标题 Hook
│   ├── layout/           # 布局组件
│   │   ├── components/   # 布局子组件
│   │   │   ├── Breadcrumb/  # 面包屑导航
│   │   │   └── Logo/        # Logo 组件
│   │   ├── config/       # 布局配置
│   │   │   └── menu.tsx  # 菜单配置
│   │   └── MainLayout.tsx   # 主布局
│   ├── pages/            # 页面组件
│   │   ├── Home/         # 首页（数据概览仪表盘）
│   │   ├── Fund/         # 基金监控
│   │   ├── Tools/        # 工具页面
│   │   │   └── CodeCompress/  # 代码压缩
│   │   ├── User/         # 用户管理
│   │   │   ├── List/     # 用户列表
│   │   │   └── Detail/   # 用户详情
│   │   ├── Settings/     # 设置页面
│   │   │   ├── index.tsx
│   │   │   ├── Basic/    # 基础设置
│   │   │   └── Advanced/ # 高级设置
│   │   └── NotFound/     # 404 页面
│   ├── routes/           # 路由配置（模块化）
│   │   ├── index.tsx     # 路由汇总导出
│   │   ├── types.ts      # 类型定义
│   │   └── modules/      # 路由模块
│   │       ├── home.tsx      # 首页路由
│   │       ├── invest.tsx    # 投资理财路由
│   │       ├── tools.tsx     # 工具包路由
│   │       ├── user.tsx      # 用户管理路由
│   │       ├── settings.tsx  # 设置路由
│   │       └── error.tsx     # 错误页面路由
│   ├── App.tsx           # 主应用组件
│   ├── main.tsx          # 应用入口
│   └── index.css         # 全局样式
├── .eslintrc.js          # ESLint 配置（已迁移到 eslint.config.js）
├── eslint.config.js      # ESLint 配置（Flat Config）
├── .prettierrc.json      # Prettier 配置
├── .prettierignore       # Prettier 忽略文件
├── index.html            # HTML 模板
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript 配置
├── tsconfig.app.json     # 应用 TypeScript 配置
├── tsconfig.node.json    # Node TypeScript 配置
├── uno.config.ts         # UnoCSS 配置
└── vite.config.ts        # Vite 配置
```

## 功能特性

### 核心功能
- ✅ **React 19** - 最新版本，支持并发特性
- ✅ **TypeScript** - 完整类型支持，类型安全
- ✅ **Ant Design** - 企业级 UI 组件库
- ✅ **React Router** - 声明式路由管理
- ✅ **路由懒加载** - 按需加载页面组件
- ✅ **模块化路由** - 路由按功能模块拆分，易于维护
- ✅ **多层菜单** - 支持嵌套菜单结构
- ✅ **面包屑导航** - 自动生成面包屑路径
- ✅ **动态标题** - 根据路由自动更新页面标题
- ✅ **页面过渡动画** - 使用 View Transitions API 实现丝滑切换

### 开发体验
- ✅ **Vite** - 极速的开发服务器和构建
- ✅ **热模块替换 (HMR)** - 快速开发反馈
- ✅ **路径别名** - 使用 `@/` 引用 `src` 目录
- ✅ **ESLint** - 代码质量检查
- ✅ **Prettier** - 代码自动格式化
- ✅ **保存时自动格式化** - VS Code 配置
- ✅ **UnoCSS** - 原子化 CSS，快速样式开发

### 公共组件
- ✅ **DataTable** - 数据表格组件（加载状态、斑马纹、自动高度）
- ✅ **SearchBar** - 搜索栏组件（多字段、展开/收起）
- ✅ **Pagination** - 分页组件（快速跳转、每页条数选择）
- ✅ **TextButton** - 文本按钮组件

## 路径别名

项目配置了路径别名，使用 `@/` 指向 `src` 目录：

```tsx
// ❌ 不推荐：使用相对路径
import { routes } from '../../../routes'
import DataTable from '../../components/DataTable'

// ✅ 推荐：使用路径别名
import { routes } from '@/routes'
import DataTable from '@/components/DataTable'
```

### 配置说明

- **Vite**: 在 `vite.config.ts` 中配置了 `resolve.alias`
- **TypeScript**: 在 `tsconfig.app.json` 中配置了 `paths`

## 代码规范

### ESLint

项目使用 ESLint 9 的 Flat Config 格式，集成了：
- TypeScript ESLint
- React Hooks 规则
- Prettier 集成

### Prettier

代码格式化配置：
- 单引号
- 不使用分号
- 2 空格缩进
- 100 字符行宽

### VS Code 配置

项目包含 `.vscode/settings.json`，配置了：
- 保存时自动格式化（Prettier）
- 保存时自动修复 ESLint 问题
- 支持 Flat Config 格式

## 开发指南

### 添加新页面

1. 在 `src/pages` 目录下创建页面组件
2. 在 `src/routes/modules/` 对应模块文件中添加路由（或新建模块）
3. 路由会自动生成菜单和面包屑

### 使用公共组件

参考 [组件使用文档](./docs/components-usage.md) 了解如何使用公共组件。

### 自定义样式

项目使用 UnoCSS，可以通过以下方式添加样式：

```tsx
// 使用 UnoCSS 原子类
<div className="flex items-center gap-4 p-6">

// 使用 Ant Design 的 style 属性
<div style={{ padding: '16px' }}>
```

## 路由配置

路由采用模块化设计，按功能拆分到 `src/routes/modules/` 目录，支持：
- 路由元信息（meta）
- 路由图标（icon）
- 嵌套路由（children）
- 隐藏菜单项（hideInMenu）

### 添加新路由模块

1. 在 `src/routes/modules/` 下创建新文件（如 `example.tsx`）：

```tsx
import { lazy } from 'react'
import { ExampleOutlined } from '@ant-design/icons'
import type { ExtendedRouteObject } from '../types'

const ExamplePage = lazy(() => import('@/pages/Example'))

const exampleRoutes: ExtendedRouteObject[] = [
  {
    path: '/example',
    icon: <ExampleOutlined />,
    meta: {
      name: '示例模块',
    },
    children: [
      {
        path: 'list',
        element: <ExamplePage />,
        meta: {
          name: '示例列表',
        },
      },
    ],
  },
]

export default exampleRoutes
```

2. 在 `src/routes/index.tsx` 中导入并添加：

```tsx
import exampleRoutes from './modules/example'

export const routes = [
  ...homeRoutes,
  ...exampleRoutes,  // 新增
  ...errorRoutes,
]
```

## 浏览器支持

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 相关文档

- [组件使用文档](./docs/components-usage.md)
- [DataTable 组件文档](./docs/components/DataTable.md)
- [SearchBar 组件文档](./docs/components/SearchBar.md)
- [Pagination 组件文档](./docs/components/Pagination.md)

## 更新日志

### v1.1.0 (2026-01-30)
- ✅ 路由模块化重构，按功能拆分
- ✅ 新增 View Transitions API 页面过渡动画
- ✅ 新增基金监控页面
- ✅ 新增代码压缩工具
- ✅ 移除 framer-motion，使用原生浏览器动画

### v1.0.0 (2024-01-20)
- ✅ 初始版本
- ✅ React 19 + TypeScript + Ant Design 基础架构
- ✅ 路由管理和多层菜单
- ✅ 公共组件封装（DataTable、SearchBar、Pagination）
- ✅ ESLint + Prettier 代码规范
- ✅ 路径别名配置
- ✅ VS Code 自动格式化配置

## 许可证

MIT
