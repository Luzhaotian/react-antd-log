# 更新日志

本文件记录项目版本变更。格式：新版本在前。

## v1.4.0 (2026-07-20)

- ✅ 补充 AI 文档：`AGENTS.md`（主文档）、`CLAUDE.md`（Claude Code 入口）、`.claude/settings.json`
- ✅ 新增项目级代码审查 Skill（`.cursor/skills/code-review/`）
- ✅ 应用入口收敛至 `main.tsx`，移除 `App.tsx`；登录页懒加载
- ✅ AI 配置拆分：`apiKey` 改存 `sessionStorage`（`src/utils/aiConfig.ts`）
- ✅ `/ai-resume` 路由重定向至 `/resume-editor/*`
- ✅ 基金列表 API：`fundgz` 失败时回退 `FundMNFInfo`
- ✅ Vite 构建分包（react-vendor / antd / echarts / docs）

## v1.3.0 (2026-07-12)

- ✅ 基金监控升级：持仓录入、组合统计、昨日涨跌、估算偏差、拖拽排序
- ✅ 基金详情弹窗：季报持仓明细、基金经理、收益率
- ✅ 本机私有持仓快照（`src/private/fund-portfolio/`，gitignore）
- ✅ GitHub Pages：Hash 路由 + JSONP 直连，修复深链 404 与生产 CORS
- ✅ 基金名称列省略显示 + 悬停 Tooltip

## v1.2.0 (2026-06-21)

- ✅ 新增简历编辑器模块（模板中心、我的简历、编辑工作台）
- ✅ 支持 JSON / PDF / Word / Markdown / TXT 文件导入
- ✅ 集成 AI 解析（OpenAI、DeepSeek、自定义兼容接口）
- ✅ 简历数据 Zustand 持久化存储
- ✅ 导出 JSON / Markdown

## v1.1.0 (2026-01-30)

- ✅ 路由模块化重构
- ✅ View Transitions API 页面过渡动画
- ✅ 新增基金监控、代码压缩工具
- ✅ 移除 framer-motion，使用原生浏览器动画

## v1.0.0 (2024-01-20)

- ✅ 初始版本：React 19 + TypeScript + Ant Design 基础架构
- ✅ 路由管理、多层菜单、公共组件封装
- ✅ ESLint + Prettier 代码规范
