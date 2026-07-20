---
name: frontend-architecture
description: 前端架构师 - 当用户说"前端架构师"或提到架构设计、组件架构、状态管理、数据流、路由设计、项目结构、新增模块页面、代码重构、性能优化、技术选型、设计模式时触发。又名 frontend-architect / architect / 架构师。Guides architectural decisions, reviews component design, ensures consistency across the project.
version: 1.1.0
updated: 2026-07-19
---

# 前端架构师（Frontend Architecture）

> **触发名**：`前端架构师` / `frontend-architecture` / `架构师`
> **版本**：1.1.0（2026-07-19）

作为前端架构师角色，负责审查和指导项目的架构决策、组件设计、状态管理、数据流、路由设计和项目结构。具体内容在下方 reference 中，按需查阅。

**全仓代码审查**：优先使用同目录旁的 [code-review](../code-review/SKILL.md)。

## When to Use This Skill

- **新增模块/页面** → [project-structure.md](project-structure.md) + [route-and-layout-architecture.md](route-and-layout-architecture.md)
- **设计组件或选择组件模式** → [component-architecture.md](component-architecture.md)
- **状态管理方案选型** → [state-and-data-flow.md](state-and-data-flow.md)
- **理解架构决策和核心模式** → [architecture-decisions.md](architecture-decisions.md)
- **设计数据流和 API 交互** → [state-and-data-flow.md](state-and-data-flow.md)
- **路由和布局设计** → [route-and-layout-architecture.md](route-and-layout-architecture.md)
- **重构代码结构** → [project-structure.md](project-structure.md)
- **性能优化依据** → [architecture-decisions.md](architecture-decisions.md)
- **代码审查（架构层面）** → [../code-review/SKILL.md](../code-review/SKILL.md)

## Architecture at a Glance

```
┌─────────────────────────────────────────────────────┐
│                    main.tsx（唯一入口）                │
│  ConfigProvider(antd) → RouterProvider(react-router) │
├─────────────────────────────────────────────────────┤
│  /login  → Login                                     │
│  /       → RequireAuth → MainLayout → Outlet(lazy)   │
│              Home / Fund / Tools / User / …          │
│              user-requirement / ai-resume            │
│              resume-editor（Zustand）/ settings/test  │
└─────────────────────────────────────────────────────┘
```

> 入口唯一：`main.tsx`（已移除未使用的 `App.tsx`）。

## Core Architecture Principles

1. **路由驱动一切** — 菜单、面包屑、页面标题从路由配置生成
2. **模板组件优先** — ListPage / PageDetail + DataTable / SearchBar
3. **状态分层** — 默认 React 内置 + storage；复杂域可用 Zustand（ResumeEditor）
4. **按模块拆分** — routes/modules + pages + types/constants
5. **组件分层** — 模板 > 封装 > antd > 自定义
6. **重依赖按需加载** — echarts / xlsx / pdf / mammoth / jspdf 禁止无谓顶层静态导入

## Detailed References

- [architecture-decisions.md](architecture-decisions.md)
- [component-architecture.md](component-architecture.md)
- [state-and-data-flow.md](state-and-data-flow.md)
- [route-and-layout-architecture.md](route-and-layout-architecture.md)
- [project-structure.md](project-structure.md)
