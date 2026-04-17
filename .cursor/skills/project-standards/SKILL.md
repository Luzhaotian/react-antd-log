---
name: project-standards
description: Enforces unified project standards: code conventions (Prettier, ESLint, file structure, import order), project components in src/components (DataTable, Pagination, SearchBar, etc.), and component doc sync. Use when writing code, choosing components, or when the user asks about code style, conventions, file structure, project standards, or component documentation. Details live in reference files—read only the one you need.
---

# Project Standards（代码规范 + 项目组件 + 文档同步）

统一项目的开发规范：**代码规范**、**项目通用组件**、**组件文档同步**。具体内容在下方 reference 中，按需查阅以节省 tokens。

## When to Use Which

- **代码风格、文件结构、导入顺序、组件写法** → [code-standards-reference.md](code-standards-reference.md)
- **选用/使用 DataTable、Pagination、SearchBar、TextButton、BeforeUnload、FilePreview、PageDetail** → [project-components-reference.md](project-components-reference.md)
- **新增/修改/删除组件时更新文档与本 Skill** → [component-doc-sync-reference.md](component-doc-sync-reference.md)

## Quick Conventions

- Prettier：无分号、单引号、2 空格、100 字符宽；路径用 `@/`。
- 组件优先用 `src/components` 下封装，再考虑 antd 或自定义。
- 组件有变更时同步 `docs/components/<Name>.md` 与 project-components-reference.md。

Use the reference files when you need full API or step-by-step rules; keep this SKILL.md for overview and discovery.
