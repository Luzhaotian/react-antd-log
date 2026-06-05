# React + Ant Design 热点收集管理系统

## Project

React 19 + TypeScript + Ant Design 6 后台管理系统，使用 Vite 7 构建，支持 Hash/History 路由切换，部署于 GitHub Pages。

**入口**: `src/main.tsx` → `src/App.tsx` → `src/layout/MainLayout.tsx`

## Commands

```bash
npm run dev          # 开发服务器 (http://localhost:5173)
npm run build        # 构建生产版本 (tsc -b && vite build)
npm run preview      # 预览生产构建
npm run lint         # ESLint 检查
npm run lint:fix     # ESLint 自动修复
npm run format       # Prettier 格式化
npm run format:check # Prettier 检查
```

## Architecture

```
src/
├── api/            # API 请求封装
├── components/     # 公共组件 (DataTable, SearchBar, Pagination, TextButton, RequireAuth)
├── config/         # 配置文件 (routes.ts)
├── constants/      # 常量定义 (APP_NAME 等)
├── hooks/          # 自定义 Hooks (useDocumentTitle)
├── layout/         # 布局组件 (MainLayout, Logo, Breadcrumb, menu配置)
├── pages/          # 页面组件 (Home, Fund, Tools, User, Settings, Login, NotFound)
├── routes/         # 路由配置 (模块化: home, invest, tools, user, settings, test, error)
├── types/          # TypeScript 类型定义
└── utils/          # 工具函数 (clearAuthSession 等)
```

**核心模块**:

- `src/routes/modules/` - 路由按功能模块拆分，支持懒加载
- `src/layout/config/menu.tsx` - 菜单配置，与路由联动
- `src/components/` - 公共组件，支持 DataTable/SearchBar/Pagination 组合

## Conventions

- **路径别名**: 使用 `@/` 引用 `src` 目录，禁止相对路径
- **路由懒加载**: 页面组件使用 `lazy()` 动态导入
- **状态优化**: 使用 `useMemo`/`useCallback` 优化性能
- **页面过渡**: 使用 View Transitions API (`navigate(key, { viewTransition: true })`)
- **主题**: 红色主题色 `#ff4d4f`，中文 locale (`zhCN`)
- **格式化**: Prettier 单引号、无分号、2空格缩进、100字符行宽
- **Lint**: ESLint 9 Flat Config + TypeScript ESLint + Prettier 集成
- **Git Hooks**: Husky + lint-staged，提交时自动检查

## Notes

- 代理配置: `/api` → Java 后端 8080，`/fundapi`/`/fundgz`/`/fundsuggest`/`/funddata`/`/datacenter` → 东方财富基金 API
- 支持 Hash 路由 (`VITE_HASH_ROUTER=true`) 用于 GitHub Pages 部署
- 基金监控页面依赖外部 API 代理
