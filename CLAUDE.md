# Claude Code 项目说明

项目背景、命令、架构与代码约定以 **`AGENTS.md`** 为准；本文件只补充 Claude Code 侧配置，避免与 Cursor 文档重复维护。

## 使用前

1. 先读 `AGENTS.md` 获取完整项目上下文。
2. 涉及架构 / Vite / Ant Design / 组件规范 / 基金 API 时，再读 `.cursor/skills/` 下对应 Skill（Cursor 与 Claude 共用同一套项目 Skills）。

## Claude 配置

| 文件                          | 用途                            |
| ----------------------------- | ------------------------------- |
| `.claude/settings.json`       | 团队共享权限（npm、git 只读等） |
| `.claude/settings.local.json` | 本机权限（如 MCP），不提交 Git  |
| `.claude/rules/`              | 模块化规则（如 git-commit）     |

权限与行为约束以 `settings.json` 为准；自然语言约定见 `AGENTS.md` 与 `.claude/rules/`。

## 与 Cursor 的分工

| 工具        | 主文档               | 规则 / Skills                              |
| ----------- | -------------------- | ------------------------------------------ |
| Cursor      | `AGENTS.md`          | `.cursor/rules/`、`.cursor/skills/`        |
| Claude Code | 本文件 → `AGENTS.md` | `.claude/rules/`、`.claude/settings*.json` |

## 本机私有数据

`src/private/` 已 gitignore。基金页快照由 `src/pages/Fund/privateBootstrap.ts` 加载，详见 `AGENTS.md` Notes 与 `README.md`。
