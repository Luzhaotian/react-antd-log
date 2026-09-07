# CLAUDE.md — Claude Code 专用入口

> **职责**：告诉 Claude Code **怎么在本仓工作**（读什么、权限在哪、规则在哪）。
> **项目事实**（命令、架构、约定）一律以 [`AGENTS.md`](./AGENTS.md) 为准，**本文件不重复维护**。

---

## 启动顺序（必做）

1. 读 **`AGENTS.md`** — 命令、目录、约定、代理与部署。
2. 按任务再读 **`.cursor/skills/`**（与 Cursor **共用**，不要另造一份）：

| 任务                        | Skill                   |
| --------------------------- | ----------------------- |
| 架构 / 新模块 / 路由 / 状态 | `frontend-architecture` |
| Vite / TS / antd / UnoCSS   | `project-config`        |
| 代码风格 / 通用组件         | `project-standards`     |
| 基金接口                    | `eastmoney-fund-api`    |
| 审查 / 优化点排查           | `code-review`           |

3. 遵守下文权限与 `.claude/rules/`；冲突时：**用户当轮指令 > 本文件 > AGENTS 约定**。

---

## 本仓 Claude 配置

| 路径                          | 用途                                                            | 是否提交            |
| ----------------------------- | --------------------------------------------------------------- | ------------------- |
| `.claude/settings.json`       | 团队共享权限（允许的 npm/git 只读等；禁止危险 rm / force push） | 是                  |
| `.claude/settings.local.json` | 本机权限（MCP 等）                                              | **否**（gitignore） |
| `.claude/rules/`              | Claude 侧模块化规则（如 git-commit）                            | 是                  |

- 行为与 Bash 权限以 **`settings.json`（及本机 local）** 为准。
- 自然语言项目约定以 **`AGENTS.md`** 为准；提交文案等细则以 **`.claude/rules/`** 为准。

---

## 与 Cursor 的分工（避免双写）

|          | Cursor               | Claude Code                                        |
| -------- | -------------------- | -------------------------------------------------- |
| 项目事实 | `AGENTS.md`          | 同左（先读）                                       |
| 工具入口 | （IDE 规则自动加载） | **本文件 `CLAUDE.md`**                             |
| 规则     | `.cursor/rules/`     | `.claude/rules/`（内容应对齐，如 commit 中文单行） |
| Skills   | `.cursor/skills/`    | **共用** `.cursor/skills/`                         |
| 权限/MCP | Cursor 设置 / MCP    | `.claude/settings*.json`                           |

改规范时：改 **AGENTS** 或对应 **Skill** 一次即可；不要在 `CLAUDE.md` 里再抄一份命令/目录树。

---

## Claude 侧行为摘要

- **不要**主动 `git commit` / `git push`，除非用户明确要求。
- commit message：**仅中文、单行**（见 `.claude/rules/git-commit.md`）。
- **禁止** `rm -rf /`、`rm -rf /*` 及 force push（见 `settings.json` deny）。
- 涉及 Figma：默认只读；写入仅当用户在同一条指令中明确要求（与仓库 Cursor 规则一致）。
- 本机私有数据在 `src/private/`（已 ignore）；基金快照加载见 `src/pages/Fund/privateBootstrap.ts`，细节在 `AGENTS.md` / `README.md`。

---

## 文档边界（对照）

| 文件                      | 一句话                                      |
| ------------------------- | ------------------------------------------- |
| `AGENTS.md`               | 项目是什么、怎么跑、代码怎么组织            |
| **`CLAUDE.md`（本文件）** | Claude Code 读仓顺序与本机/团队 Claude 配置 |
| `README.md`               | 给人看的安装与功能说明                      |
