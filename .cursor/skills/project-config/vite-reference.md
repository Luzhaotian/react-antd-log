# Vite Configuration Reference

Full reference for Vite config options. Config file: `vite.config.ts` (or `.js`). Use `defineConfig` for type hints.

## Config File Basics

- **Conditional config**: Export a function `(command, mode, isSsrBuild, isPreview) => config`. `command` is `'serve'` for dev, `'build'` for build.
- **Async config**: Export an async function when you need to load env or other async data.
- **Env in config**: `.env*` are loaded _after_ config. Use `loadEnv(mode, process.cwd(), '')` from `vite` if config itself depends on env.

---

## Shared Options (dev, build, preview)

| Option                     | Type                                                  | Default                             | Description                                                                                               |
| -------------------------- | ----------------------------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `root`                     | string                                                | `process.cwd()`                     | Project root (where `index.html` is).                                                                     |
| `base`                     | string                                                | `'/'`                               | Public base path (e.g. `'/app/'` or `'./'` for relative).                                                 |
| `mode`                     | string                                                | `'development'` / `'production'`    | Override mode for serve/build.                                                                            |
| `define`                   | Record<string, any>                                   | -                                   | Global constant replacements (JSON-serializable or identifier string). Declare in `vite-env.d.ts` for TS. |
| `plugins`                  | (Plugin \| Plugin[] \| Promise<...>)[]                | -                                   | Plugins; falsy ignored, arrays flattened.                                                                 |
| `publicDir`                | string \| false                                       | `'public'`                          | Static assets dir; `false` disables.                                                                      |
| `cacheDir`                 | string                                                | `'node_modules/.vite'`              | Cache directory.                                                                                          |
| `resolve.alias`            | Record or Array<{find, replacement, customResolver?}> | -                                   | Path aliases. Use **absolute** paths for filesystem.                                                      |
| `resolve.dedupe`           | string[]                                              | -                                   | Force same copy of deps (monorepos).                                                                      |
| `resolve.conditions`       | string[]                                              | -                                   | Extra conditions for package.json `exports`.                                                              |
| `resolve.mainFields`       | string[]                                              | -                                   | package.json fields for entry (e.g. `browser`, `module`).                                                 |
| `resolve.extensions`       | string[]                                              | `.mjs,.js,.mts,.ts,.jsx,.tsx,.json` | Extensions for extensionless imports.                                                                     |
| `resolve.preserveSymlinks` | boolean                                               | false                               | Resolve by symlink path.                                                                                  |
| `css.modules`              | object                                                | -                                   | CSS Modules (postcss-modules options).                                                                    |
| `css.postcss`              | string \| config                                      | -                                   | PostCSS config path or inline config.                                                                     |
| `css.preprocessorOptions`  | Record<string, object>                                | -                                   | Options for sass/scss, less, styl.                                                                        |
| `css.devSourcemap`         | boolean                                               | false                               | CSS sourcemaps in dev.                                                                                    |
| `css.transformer`          | 'postcss' \| 'lightningcss'                           | 'postcss'                           | CSS engine.                                                                                               |
| `json.namedExports`        | boolean                                               | true                                | Named imports from JSON.                                                                                  |
| `json.stringify`           | boolean \| 'auto'                                     | 'auto'                              | Stringify large JSON for perf.                                                                            |
| `esbuild`                  | ESBuildOptions \| false                               | -                                   | esbuild transform (e.g. jsxFactory, jsxFragment, include/exclude). Set `false` to disable.                |
| `assetsInclude`            | string \| RegExp \| (string \| RegExp)[]              | -                                   | Extra patterns treated as static assets.                                                                  |
| `logLevel`                 | 'info' \| 'warn' \| 'error' \| 'silent'               | 'info'                              | Log verbosity.                                                                                            |
| `clearScreen`              | boolean                                               | true                                | Clear terminal on log.                                                                                    |
| `envDir`                   | string \| false                                       | root                                | Dir for `.env` files; `false` disables.                                                                   |
| `envPrefix`                | string \| string[]                                    | `'VITE_'`                           | Prefix for client-exposed env (never use `''`).                                                           |
| `appType`                  | 'spa' \| 'mpa' \| 'custom'                            | 'spa'                               | SPA fallback / MPA / custom (e.g. SSR).                                                                   |

---

## Server Options (dev only)

| Option                  | Type                                                                   | Default             | Description                                                                                                   |
| ----------------------- | ---------------------------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------- |
| `server.host`           | string \| boolean                                                      | 'localhost'         | Listen address; `0.0.0.0` or `true` for all.                                                                  |
| `server.port`           | number                                                                 | 5173                | Port.                                                                                                         |
| `server.strictPort`     | boolean                                                                | -                   | Exit if port in use (no next port).                                                                           |
| `server.open`           | boolean \| string                                                      | -                   | Open browser; string = pathname.                                                                              |
| `server.proxy`          | Record<string, string \| ProxyOptions>                                 | -                   | Proxy rules. Key = path prefix; value = target or `{ target, changeOrigin, rewrite, secure, ws, configure }`. |
| `server.cors`           | boolean \| CorsOptions                                                 | (localhost origins) | CORS; `true` = any origin (unsafe).                                                                           |
| `server.headers`        | OutgoingHttpHeaders                                                    | -                   | Response headers.                                                                                             |
| `server.hmr`            | boolean \| { protocol, host, port, path, overlay, clientPort, server } | -                   | HMR config; `overlay: false` disables error overlay.                                                          |
| `server.warmup`         | { clientFiles?, ssrFiles? }                                            | -                   | Pre-transform files (paths or globs).                                                                         |
| `server.watch`          | object \| null                                                         | chokidar options    | File watcher; `null` = no watch.                                                                              |
| `server.middlewareMode` | boolean                                                                | false               | Run as middleware (e.g. with Express).                                                                        |
| `server.https`          | https.ServerOptions                                                    | -                   | TLS/HTTP2.                                                                                                    |
| `server.allowedHosts`   | string[] \| true                                                       | []                  | Allowed hostnames; `true` = any (unsafe).                                                                     |
| `server.fs.strict`      | boolean                                                                | true                | Restrict serving outside workspace.                                                                           |
| `server.fs.allow`       | string[]                                                               | -                   | Allowed paths for `/@fs/`.                                                                                    |
| `server.fs.deny`        | string[]                                                               | .env, .git, etc.    | Deny patterns.                                                                                                |
| `server.origin`         | string                                                                 | -                   | Origin for asset URLs in dev.                                                                                 |

### Proxy Example

```typescript
server: {
  proxy: {
    '/api': {
      target: 'https://api.example.com',
      changeOrigin: true,
      rewrite: path => path.replace(/^\/api/, ''),
      secure: false,
    },
  },
},
```

---

## Build Options (build only)

| Option                        | Type                                                | Default                     | Description                                                               |
| ----------------------------- | --------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------- |
| `build.target`                | string \| string[]                                  | 'baseline-widely-available' | esbuild target (e.g. 'es2015', 'chrome58'); 'esnext' = minimal transpile. |
| `build.outDir`                | string                                              | 'dist'                      | Output directory.                                                         |
| `build.assetsDir`             | string                                              | 'assets'                    | Subdir for assets under outDir.                                           |
| `build.assetsInlineLimit`     | number \| (filePath, content) => boolean            | 4096                        | Inline assets smaller than this (bytes); 0 = no inline.                   |
| `build.cssCodeSplit`          | boolean                                             | true                        | Split CSS per async chunk.                                                |
| `build.cssTarget`             | string \| string[]                                  | same as target              | CSS minification target.                                                  |
| `build.cssMinify`             | boolean \| 'esbuild' \| 'lightningcss'              | same as minify              | CSS minifier.                                                             |
| `build.sourcemap`             | boolean \| 'inline' \| 'hidden'                     | false                       | Production source maps.                                                   |
| `build.rollupOptions`         | RollupOptions                                       | -                           | Rollup config (input, output.manualChunks, etc.).                         |
| `build.commonjsOptions`       | -                                                   | -                           | @rollup/plugin-commonjs options.                                          |
| `build.lib`                   | { entry, name?, formats?, fileName?, cssFileName? } | -                           | Library mode (no HTML entry).                                             |
| `build.manifest`              | boolean \| string                                   | false                       | Generate manifest (e.g. for backend).                                     |
| `build.ssr`                   | boolean \| string                                   | false                       | SSR entry.                                                                |
| `build.minify`                | boolean \| 'terser' \| 'esbuild'                    | 'esbuild'                   | Minifier.                                                                 |
| `build.terserOptions`         | TerserOptions                                       | -                           | Terser options when minify is 'terser'.                                   |
| `build.reportCompressedSize`  | boolean                                             | true                        | Gzip size report.                                                         |
| `build.chunkSizeWarningLimit` | number                                              | 500                         | Chunk size warning (kB).                                                  |
| `build.emptyOutDir`           | boolean                                             | true if outDir in root      | Empty outDir before build.                                                |
| `build.copyPublicDir`         | boolean                                             | true                        | Copy publicDir to outDir.                                                 |
| `build.modulePreload`         | boolean \| { polyfill?, resolveDependencies? }      | { polyfill: true }          | Module preload polyfill.                                                  |
| `build.watch`                 | WatcherOptions \| null                              | null                        | Rollup watch (build-only plugins).                                        |

---

## Environment Variables

- **Files**: `.env`, `.env.local`, `.env.[mode]`, `.env.[mode].local`. Loaded after config; only `envPrefix` (default `VITE_`) exposed to client.
- **In code**: `import.meta.env.VITE_*` (e.g. `import.meta.env.VITE_API_URL`).
- **Types**: Add to `vite-env.d.ts`: `interface ImportMetaEnv { readonly VITE_APP_TITLE: string }`.

---

## Optimize Dependencies (Pre-bundling)

- `optimizeDeps.include` / `optimizeDeps.exclude`: Force include/exclude deps from pre-bundle.
- `optimizeDeps.entries`: Custom entry points (default: root index.html scan).
- `optimizeDeps.esbuildOptions`: esbuild options for dep pre-bundling.
- `optimizeDeps.holdUntilCrawlEnd`: Wait for full crawl before pre-bundle (experimental).

---

## Preview (Production-like Serve)

- `preview.host` / `preview.port` / `preview.strictPort`: Same semantics as server.
- `preview.proxy`: Same as server.proxy.
- `preview.cors` / `preview.headers`: Same as server.

---

## Worker Options

- `worker.format`: 'es' | 'iife' (default 'iife').
- `worker.plugins`: Plugins for worker bundles.
- `worker.rollupOptions`: Rollup options for workers.

---

## Path Alias (Project Convention)

This project uses `@/` → `./src`. In config:

```typescript
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

Keep `tsconfig.app.json` (and any app tsconfig) in sync: `"paths": { "@/*": ["./src/*"] }`, `"baseUrl": "."`.
