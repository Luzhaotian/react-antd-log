# AI 工具目录

本文档统一管理项目中的所有 AI 相关配置（Skills / Rules / Hooks），作为唯一入口索引。

---

## 目录结构

```
.cursor/
├── ai-tools-catalog.md          ← 本文件：统一管理入口
├── hooks.json                   ← Hook 注册配置
├── hooks/
│   └── check-ai-keywords.sh     ← AI 输出后置检查
├── rules/                       ← 始终生效的 AI 行为规则
│   ├── git-commit.mdc
│   ├── restrict-one-click-clear.mdc
│   └── figma-readonly.mdc
└── skills/                      ← 4 个项目级 Skill
    ├── frontend-architecture/   ← 前端架构师（6 文件）
    ├── project-config/          ← 项目配置（5 文件）
    ├── project-standards/       ← 项目规范（4 文件）
    └── eastmoney-fund-api/      ← 东方财富 API（1 文件）
```

---

## 一、Skills（项目级 AI 技能）

### 1.1 前端架构师

| 项目                  | 内容                                                                                                                                                            |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **名称**              | `frontend-architecture`                                                                                                                                         |
| **触发词**            | `前端架构师`、`架构师`、`架构设计`、`组件架构`、`状态管理`、`数据流`、`路由设计`、`项目结构`、`新增模块`、`代码重构`、`性能优化`、`技术选型`、`设计模式`        |
| **路径**              | `.cursor/skills/frontend-architecture/`                                                                                                                         |
| **文件**              | `SKILL.md` + `architecture-decisions.md` + `component-architecture.md` + `state-and-data-flow.md` + `route-and-layout-architecture.md` + `project-structure.md` |
| **职责**              | 架构决策指导、组件分层设计、状态管理方案、数据流设计、路由与布局设计、项目结构组织                                                                              |
| **与其他 Skill 关系** | 依赖 `project-config`（了解技术栈配置）+ `project-standards`（了解组件库和代码规范）                                                                            |

### 1.2 项目配置

| 项目       | 内容                                                                                                              |
| ---------- | ----------------------------------------------------------------------------------------------------------------- |
| **名称**   | `project-config`                                                                                                  |
| **触发词** | `vite.config`、`tsconfig`、`uno.config`、`Ant Design配置`、`主题`、`UnoCSS`、`全局样式`、`代理`、`路径别名`       |
| **路径**   | `.cursor/skills/project-config/`                                                                                  |
| **文件**   | `SKILL.md` + `vite-reference.md` + `typescript-reference.md` + `antd-reference.md` + `global-styles-reference.md` |
| **职责**   | Vite 构建配置、TypeScript 配置、Ant Design 主题/组件模式、UnoCSS 与全局样式                                       |

### 1.3 项目规范

| 项目       | 内容                                                                                                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------ |
| **名称**   | `project-standards`                                                                                                |
| **触发词** | `代码规范`、`Prettier`、`ESLint`、`导入顺序`、`组件用法`、`DataTable`、`SearchBar`、`ListPage`、`组件文档`         |
| **路径**   | `.cursor/skills/project-standards/`                                                                                |
| **文件**   | `SKILL.md` + `code-standards-reference.md` + `project-components-reference.md` + `component-doc-sync-reference.md` |
| **职责**   | Prettier/ESLint 规范、文件结构、导入顺序、9 个通用组件 API、组件文档同步规则                                       |

### 1.4 东方财富基金 API

| 项目       | 内容                                                                 |
| ---------- | -------------------------------------------------------------------- |
| **名称**   | `eastmoney-fund-api`                                                 |
| **触发词** | `东方财富`、`基金API`、`fundapi`、`基金数据`、`基金估值`、`基金图表` |
| **路径**   | `.cursor/skills/eastmoney-fund-api/`                                 |
| **文件**   | `SKILL.md`                                                           |
| **职责**   | 东方财富基金 API 端点文档、JSONP 调用方式、数据结构说明              |

---

## 二、Rules（始终生效的 AI 行为规则）

这些规则在每次 AI 对话中都会自动生效，不需要手动触发。

| 规则文件                       | alwaysApply | 功能                                              |
| ------------------------------ | :---------: | ------------------------------------------------- |
| `git-commit.mdc`               |     ✅      | Git 提交信息统一为中文单行格式                    |
| `restrict-one-click-clear.mdc` |     ✅      | 严禁执行 `rm -rf /` 等危险命令                    |
| `figma-readonly.mdc`           |     ✅      | Figma 设计稿默认只读，禁止增删改；读失败不臆造 UI |

---

## 三、Hooks（AI 响应后置处理）

| 配置         | 说明                                                                                                                        |
| ------------ | --------------------------------------------------------------------------------------------------------------------------- |
| **入口**     | `.cursor/hooks.json`                                                                                                        |
| **触发时机** | 每次 AI Agent 响应后自动执行                                                                                                |
| **脚本**     | `.cursor/hooks/check-ai-keywords.sh`                                                                                        |
| **功能**     | 检测 AI 输出中是否出现高风险变量名声明（event、name、status、location、window 等 30+ 个），记录日志到 `.cursor/hooks/logs/` |
| **是否阻断** | ❌ 不阻断 AI 生成，仅记录日志提示                                                                                           |

---

## 四、外部配置

| 配置                                   | 说明                                                                                                  |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `.claude/settings.local.json`          | Claude Code 本地权限：允许 mcp\_\_mcpServers                                                          |
| `docs/skills-mcp/MCP安装与配置清单.md` | 5 个 MCP 的安装配置指南（neural-memory / playwright / filesystem / sequential-thinking / web_reader） |
| `docs/skills-mcp/技能安装建议清单.md`  | 20 个全局 Skills 清单及维护约定                                                                       |

---

## 五、Skill 间依赖关系

```
前端架构师 (frontend-architecture)
  ├── 依赖 → project-config（技术栈配置上下文）
  ├── 依赖 → project-standards（组件库+规范上下文）
  └── 无关 → eastmoney-fund-api（独立业务）
```

---

## 六、维护说明

### 新增 Skill

1. 在 `.cursor/skills/<skill-name>/` 下创建 `SKILL.md`
2. 按需创建 reference 文件
3. 更新本文件（`ai-tools-catalog.md`）的 Skills 列表

### 新增 Rule

1. 在 `.cursor/rules/` 下创建 `.mdc` 文件
2. 在 frontmatter 中设置 `alwaysApply: true`
3. 更新本文件的 Rules 列表

### 新增 Hook

1. 编写 hook 脚本
2. 在 `.cursor/hooks.json` 中注册
3. 更新本文件的 Hooks 列表
