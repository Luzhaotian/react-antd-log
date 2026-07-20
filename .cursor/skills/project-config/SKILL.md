---
name: project-config
version: 1.1.0
updated: 2026-07-19
description: Manages all project configuration: Vite (dev server, build, resolve, env), TypeScript (tsconfig, compiler options), Ant Design (theming, imports, component patterns), and global styles (UnoCSS, index.css). Use when working with vite.config, tsconfig, uno.config, Ant Design setup, theming, UnoCSS, or any project configuration.
---

# Project Configuration

This skill covers **all configuration-related** setup in one place: **Vite**, **TypeScript**, **Ant Design**, and **global styles (UnoCSS)**.

## When to Use This Skill

- Editing or understanding `vite.config.ts`, `tsconfig*.json`, `uno.config.ts`
- Adding/changing dev server, proxy, build, resolve, env, or plugins
- Path aliases (`@/`), TypeScript compiler options, strict mode, type patterns
- Ant Design: imports, theme tokens, ConfigProvider, component patterns
- UnoCSS: shortcuts, theme, presets; global CSS and import order in `main.tsx`

## This Project at a Glance

- **Vite**: React + UnoCSS，`@/` → `src`，port 5173；proxy：`/api`→8080，基金相关 `/fund*` `/datacenter`。
- **TypeScript**: `tsconfig.app.json` strict；路径 `@/`。
- **Ant Design**: 6.x；`colorPrimary: #ff4d4f`，locale zhCN（`main.tsx`）。
- **UnoCSS**: presetUno + attributify；样式顺序 antd reset → uno → index.css。
- **Build**: 建议 `manualChunks`（见 vite-reference「Project Build Conventions」）。
- **Env**: `VITE_BASE_PATH`、`VITE_HASH_ROUTER`。

## Detailed References

- **Vite**: [vite-reference.md](vite-reference.md) — shared options, server, build, resolve, env, plugins, preview, optimizeDeps.
- **TypeScript**: [typescript-reference.md](typescript-reference.md) — root fields, compilerOptions, project references, type patterns.
- **Ant Design**: [antd-reference.md](antd-reference.md) — imports, theme tokens, ConfigProvider, component patterns, best practices.
- **Global styles & UnoCSS**: [global-styles-reference.md](global-styles-reference.md) — uno.config, shortcuts, index.css, import order.

Use the reference files when you need to look up or add configuration; keep this SKILL.md for overview and discovery.

## Quick Conventions

- Use `defineConfig` from `vite` in `vite.config.ts`; keep path alias in sync with tsconfig `paths`.
- Build: `tsc -b && vite build`.
- Styles: antd reset → `virtual:uno.css` → `index.css` in `main.tsx`.
