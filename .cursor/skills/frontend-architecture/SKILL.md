---
name: frontend-architecture
description: 前端架构师 - 当用户说"前端架构师"或提到架构设计、组件架构、状态管理、数据流、路由设计、项目结构、新增模块页面、代码重构、性能优化、技术选型、设计模式时触发。又名 frontend-architect / architect / 架构师。Guides architectural decisions, reviews component design, ensures consistency across the project.
---

# 前端架构师（Frontend Architecture）

> **触发名**：`前端架构师` / `frontend-architecture` / `架构师`

作为前端架构师角色，负责审查和指导项目的架构决策、组件设计、状态管理、数据流、路由设计和项目结构。具体内容在下方 reference 中，按需查阅。

## When to Use This Skill

当你需要做以下事情时，触发此 Skill：

- **新增模块/页面** → [project-structure.md](project-structure.md) + [route-and-layout-architecture.md](route-and-layout-architecture.md)
- **设计组件或选择组件模式** → [component-architecture.md](component-architecture.md)
- **状态管理方案选型** → [state-and-data-flow.md](state-and-data-flow.md)
- **理解架构决策和核心模式** → [architecture-decisions.md](architecture-decisions.md)
- **设计数据流和 API 交互** → [state-and-data-flow.md](state-and-data-flow.md)
- **路由和布局设计** → [route-and-layout-architecture.md](route-and-layout-architecture.md)
- **重构代码结构** → [project-structure.md](project-structure.md)
- **性能优化** → [architecture-decisions.md](architecture-decisions.md)
- **代码审查（架构层面）** → 根据变更内容选择对应 reference

## Architecture at a Glance

```
┌─────────────────────────────────────────────────────┐
│                    main.tsx                          │
│  ConfigProvider(antd) → RouterProvider(react-router) │
├─────────────────────────────────────────────────────┤
│  /login  → <Login />                                │
│  /       → <RequireAuth> → <MainLayout>             │
│              ├── Sider (Logo + Menu)                │
│              ├── Header (Breadcrumb + User)          │
│              └── Content (Suspense + Outlet)          │
│                    ├── / → Home (lazy)               │
│                    ├── /invest/fund → Fund (lazy)    │
│                    ├── /tools/* → Tools (lazy)       │
│                    ├── /user/* → User (lazy)         │
│                    ├── /settings/* → Settings (lazy) │
│                    └── ...                           │
└─────────────────────────────────────────────────────┘
```

## Core Architecture Principles

1. **路由驱动一切** — 菜单、面包屑、页面标题全部从路由配置自动生成
2. **模板组件优先** — ListPage / PageDetail 统一页面结构，DataTable / SearchBar 统一交互模式
3. **无全局状态库** — 依赖 React 内置状态 + localStorage + 自定义 Hooks
4. **按模块拆分** — 路由模块化、页面独立目录、类型集中管理
5. **组件分层** — 模板组件 > 封装组件 > antd 原始组件 > 自定义实现

## Detailed References

- **架构决策**：[architecture-decisions.md](architecture-decisions.md) — 核心技术选型依据、架构模式、设计原则、性能策略
- **组件架构**：[component-architecture.md](component-architecture.md) — 组件分层体系、模板/封装/守卫组件设计、组合模式
- **状态与数据流**：[state-and-data-flow.md](state-and-data-flow.md) — 状态管理方案、API 层设计、数据持久化、数据流向
- **路由与布局**：[route-and-layout-architecture.md](route-and-layout-architecture.md) — 路由设计、布局组件、菜单生成、导航守卫
- **项目结构**：[project-structure.md](project-structure.md) — 目录组织、文件命名、模块拆分原则、新增模块步骤

Use the reference files when you need to make architectural decisions; keep this SKILL.md for overview and discovery.
