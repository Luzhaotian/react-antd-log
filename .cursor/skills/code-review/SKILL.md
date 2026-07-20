---
name: code-review
description: 项目代码审查 - 当用户说「审查」「code review」「优化点排查」「按 Skills 审查」时触发。对照本仓库架构/规范/配置 Skills 做只读审查，输出问题清单，默认不改业务代码。
version: 1.1.0
updated: 2026-07-19
---

# 项目代码审查（code-review）

> **版本**：1.1.0（2026-07-19）
> **触发**：审查 / code review / 优化点排查 / 按 Skills 审查

## 原则

1. **先读 Skill、再审代码**：以本仓库 `.cursor/skills` 为准，不凭通用模板臆测规范。
2. **默认只读**：只输出审查报告；**未经用户确认不得改 `src/` 业务代码**。
3. **可改 Skill 文档**：若规范与代码现状脱节，可先更新 Skills，再审查。
4. **分级如实**：Critical / Important / Minor；每条给文件路径与理由。

## 依赖的本地 Skills（审查依据）

| Skill                                                      | 用途                       |
| ---------------------------------------------------------- | -------------------------- |
| [frontend-architecture](../frontend-architecture/SKILL.md) | 架构、路由、状态、性能清单 |
| [project-standards](../project-standards/SKILL.md)         | 代码规范、通用组件选用     |
| [project-config](../project-config/SKILL.md)               | Vite / TS / antd / UnoCSS  |
| [eastmoney-fund-api](../eastmoney-fund-api/SKILL.md)       | 基金 API（审 Fund 模块时） |

可选对照（全局已安装，非本仓）：`vercel-react-best-practices`（体积/重渲染）、`dependency-auditor`（依赖）。

## 工作流

```
1. 读取本 SKILL + 上表相关 reference（按审查范围）
2. 若 Skills 描述与仓库现状不符 → 先更新 Skills，再审
3. 对照下方清单抽样/全量检查代码
4. 输出「审查报告」（见模板）
5. 询问用户：是否按某几条开始优化（默认不动手）
```

## 审查清单

### A. 入口与路由

- [ ] 入口是否为 `main.tsx`（勿假设 `App.tsx` 已挂载）
- [ ] 业务页是否 `lazy()`；Login 是否避免静态进首包
- [ ] 路由模块与 `pages/`、`menu` 是否一致（含 ai-resume / resume-editor）

### B. 包体积与重依赖

- [ ] `vite.config.ts` 是否有合理 `manualChunks`（react / antd / 重 vendor）
- [ ] echarts：避免默认路由全量静态引入；弹窗场景宜 `lazy`
- [ ] xlsx / pdf / mammoth / docx-preview / jspdf：按使用点动态 `import()`
- [ ] `@/utils` barrel 不承接重型导出模块（宜深路径导入）

### C. 状态与数据流

- [ ] 默认 React 内置状态；复杂域可用 Zustand（如 ResumeEditor）
- [ ] Zustand：selector 订阅；`persist` 写入防抖
- [ ] 鉴权：`getAuthToken` 是否真正接入 request；勿仅靠前端 flag
- [ ] 敏感信息（API Key）勿长期明文依赖 localStorage（生产）

### D. 规范与组件

- [ ] 路径别名 `@/`；Prettier/ESLint 约定
- [ ] 列表页优先 ListPage + DataTable + SearchBar + Pagination
- [ ] 无收益的 `useCallback`/`useMemo`、双份派生 state（memo→effect→state）应标出

### E. 架构债

- [ ] 死代码 / 未接入文件
- [ ] 重复业务模块（如 AiResume ∥ ResumeEditor）
- [ ] Skills / AGENTS.md 与代码是否一致

## 输出模板（必须遵守）

```markdown
# 代码审查报告

- **Skill**：code-review vX.Y.Z
- **依据**：frontend-architecture / project-standards / project-config …
- **范围**：全仓 | 某模块 | 某 diff
- **结论**：概要一句

## Critical

| 位置 | 问题 | 依据 |

## Important

| 位置 | 问题 | 依据 |

## Minor

| 位置 | 问题 | 依据 |

## 通过项

- …

## 建议优先处理（供你选择，默认不改代码）

1. …
2. …
```

## 与 Cursor 内置 review 的区别

| 类型                     | 路径                               | 适用                                |
| ------------------------ | ---------------------------------- | ----------------------------------- |
| **本 Skill（项目审查）** | `.cursor/skills/code-review`       | 对照本仓规范做全仓/模块体检         |
| Bugbot / Security        | `~/.cursor/skills-cursor/review-*` | 针对 git diff / PR 的缺陷与安全审查 |

用户说「按本地 Skills 审查 / 查优化点」→ 用本 Skill。
用户说 `/review-bugbot` 或 `/review-security` → 走对应内置 Skill。
