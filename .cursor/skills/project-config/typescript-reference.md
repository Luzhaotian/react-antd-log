# TypeScript Configuration Reference

Full reference for `tsconfig.json` and type patterns. Official docs: https://www.typescriptlang.org/tsconfig

## Root-Level Fields

| Field        | Description                                                                                           |
| ------------ | ----------------------------------------------------------------------------------------------------- |
| `files`      | Explicit list of files to include (no glob). Use `include` for patterns.                              |
| `include`    | Glob patterns (e.g. `["src/**/*"]`). Default `**/*` if `files` not set.                               |
| `exclude`    | Patterns to exclude from `include`. Default includes `node_modules`, `outDir`.                        |
| `extends`    | Path to base config (e.g. `"./tsconfig.base.json"`). Relative paths resolved from the extending file. |
| `references` | Project references: `[{ "path": "./tsconfig.app.json" }, ...]`. Use for composite projects.           |

Note: `files` / `include` / `exclude` in the extending config **overwrite** base; `references` are not inherited.

---

## compilerOptions — Type Checking

| Option                               | Default (strict) | Description                                                  |
| ------------------------------------ | ---------------- | ------------------------------------------------------------ |
| `strict`                             | -                | Master flag: enables strict family (below). **Recommended.** |
| `noImplicitAny`                      | true if strict   | Error when type is inferred as `any`.                        |
| `strictNullChecks`                   | true if strict   | `null`/`undefined` are distinct types.                       |
| `strictFunctionTypes`                | true if strict   | Stricter function parameter checking.                        |
| `strictBindCallApply`                | true if strict   | Type-check `call`/`bind`/`apply`.                            |
| `strictPropertyInitialization`       | true if strict   | Class properties must be initialized or marked optional.     |
| `noImplicitThis`                     | true if strict   | Error on `this` with implied `any`.                          |
| `noImplicitReturns`                  | false            | All code paths must return when return type is set.          |
| `noImplicitOverride`                 | false            | Overriding methods must use `override`.                      |
| `noFallthroughCasesInSwitch`         | false            | Switch cases must break/return/throw.                        |
| `noUnusedLocals`                     | false            | Error on unused locals.                                      |
| `noUnusedParameters`                 | false            | Error on unused params (prefix with `_` to allow).           |
| `allowUnreachableCode`               | undefined        | undefined = warn; true = ignore; false = error.              |
| `allowUnusedLabels`                  | undefined        | Same for unused labels.                                      |
| `alwaysStrict`                       | true if strict   | Parse in strict mode, emit "use strict".                     |
| `exactOptionalPropertyTypes`         | false            | Optional props cannot be set to `undefined` explicitly.      |
| `noPropertyAccessFromIndexSignature` | false            | Index signature access must use `obj["key"]`.                |
| `noUncheckedIndexedAccess`           | false            | Index access adds `undefined` to type.                       |
| `useUnknownInCatchVariables`         | true if strict   | Catch clause variable is `unknown` (not `any`).              |
| `strictBuiltinIteratorReturn`        | true if strict   | Stricter iterator return types.                              |

---

## compilerOptions — Modules

| Option                         | Description                                                                                                                                                                    |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `module`                       | Output module format: `none`, `commonjs`, `es6`/`es2015`, `es2020`, `es2022`, `esnext`, `node16`, `node18`, `nodenext`, `preserve`. With bundler often `ESNext` or `preserve`. |
| `moduleResolution`             | `classic`, `node`/`node10`, `node16`, `nodenext`, `bundler`. Use `bundler` with Vite.                                                                                          |
| `baseUrl`                      | Base for non-relative module resolution.                                                                                                                                       |
| `paths`                        | Path mapping, e.g. `{ "@/*": ["./src/*"] }`. Requires `baseUrl` (or TS 4.1+ allows paths without baseUrl).                                                                     |
| `rootDir`                      | Root of input files (affects output layout).                                                                                                                                   |
| `rootDirs`                     | Virtual merge of several roots.                                                                                                                                                |
| `types`                        | Only include these `@types` packages (e.g. `["node", "vite/client"]`). Empty = include none.                                                                                   |
| `typeRoots`                    | Only look here for types (replaces default `node_modules/@types`).                                                                                                             |
| `allowImportingTsExtensions`   | Allow `.ts`/`.tsx` in imports (only with `noEmit` or `emitDeclarationOnly`).                                                                                                   |
| `resolveJsonModule`            | Allow importing `.json`.                                                                                                                                                       |
| `resolvePackageJsonExports`    | Use package.json `exports` (default true with bundler/node16/nodenext).                                                                                                        |
| `resolvePackageJsonImports`    | Use package.json `imports` (same).                                                                                                                                             |
| `customConditions`             | Extra resolution conditions.                                                                                                                                                   |
| `noUncheckedSideEffectImports` | Error if side-effect import (e.g. `import "x"`) cannot be resolved.                                                                                                            |
| `verbatimModuleSyntax`         | Require `import type` / `export type` for type-only imports.                                                                                                                   |
| `isolatedModules`              | Each file must be valid in isolation (required for bundlers).                                                                                                                  |
| `erasableSyntaxOnly`           | Only allow syntax that can be erased (no enums/namespaces etc. that emit).                                                                                                     |

---

## compilerOptions — Emit

| Option               | Description                                                  |
| -------------------- | ------------------------------------------------------------ |
| `noEmit`             | Do not emit JS (use with Vite/Babel for type-check only).    |
| `outDir`             | Output directory for emitted files.                          |
| `outFile`            | Single output file (only with module `none`/`system`/`amd`). |
| `declaration`        | Emit `.d.ts`.                                                |
| `declarationDir`     | Output dir for `.d.ts`.                                      |
| `declarationMap`     | Source maps for `.d.ts`.                                     |
| `sourceMap`          | Emit `.js.map`.                                              |
| `inlineSourceMap`    | Embed source map in JS.                                      |
| `removeComments`     | Strip comments in output.                                    |
| `importHelpers`      | Use tslib for downlevel helpers.                             |
| `downlevelIteration` | Accurate iteration for older targets.                        |

---

## compilerOptions — Language and Environment

| Option                    | Description                                                    |
| ------------------------- | -------------------------------------------------------------- |
| `target`                  | Output ES version (e.g. `ES2022`, `ESNext`).                   |
| `lib`                     | Built-in type libs (e.g. `["ES2022", "DOM", "DOM.Iterable"]`). |
| `jsx`                     | `react`, `react-jsx`, `react-jsxdev`, `preserve`, etc.         |
| `jsxImportSource`         | For `react-jsx`: default import source (e.g. `react`).         |
| `useDefineForClassFields` | Use ES standard class field semantics.                         |
| `moduleDetection`         | `auto` \| `legacy` \| `force`: when to treat file as module.   |

---

## compilerOptions — Interop & Completeness

| Option                             | Description                                        |
| ---------------------------------- | -------------------------------------------------- |
| `esModuleInterop`                  | Better default import from CJS.                    |
| `allowSyntheticDefaultImports`     | Allow default import from modules with no default. |
| `forceConsistentCasingInFileNames` | Enforce case-sensitive file names.                 |
| `isolatedDeclarations`             | Require explicit types for declarations that emit. |
| `skipLibCheck`                     | Skip type check of `.d.ts` files (faster).         |

---

## compilerOptions — Projects (References)

| Option            | Description                                                  |
| ----------------- | ------------------------------------------------------------ |
| `composite`       | Enable project references; required for referenced projects. |
| `tsBuildInfoFile` | Path for incremental build info.                             |
| `incremental`     | Emit incremental info.                                       |

---

## Project References (This Project)

- **Root** `tsconfig.json`: `"files": []`, `"references": ["./tsconfig.app.json", "./tsconfig.node.json"]`.
- **tsconfig.app.json**: App code in `src/` — strict, paths `@/*` → `./src/*`, `noEmit: true`, `jsx: "react-jsx"`, `moduleResolution: "bundler"`, `types: ["vite/client"]`.
- **tsconfig.node.json**: Node scripts (e.g. `vite.config.ts`) — `include: ["vite.config.ts"]`, `types: ["node"]`.

Build: `tsc -b` (builds all referenced projects).

---

## Type Safety Patterns

### Props and state

```typescript
interface ButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
}

function Button({ label, onClick, disabled }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>{label}</button>
}
```

### Event handlers

```typescript
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault()
}
```

### API responses

```typescript
interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

async function fetchData(): Promise<ApiResponse<User[]>> {
  const res = await fetch('/api/users')
  return res.json()
}
```

### Generic components

```typescript
interface TableProps<T extends Record<string, unknown>> {
  dataSource: T[]
  columns: Array<{
    key: keyof T
    title: string
    render?: (value: T[keyof T], record: T) => React.ReactNode
  }>
}

function Table<T extends Record<string, unknown>>({ dataSource, columns }: TableProps<T>) {
  // ...
}
```

### Catch (with useUnknownInCatchVariables or explicit)

```typescript
try {
  // ...
} catch (err: unknown) {
  if (err instanceof Error) console.log(err.message)
}
```

### Path alias

Use `@/` for `src/` imports; must match both Vite and TS config.

```typescript
import { Button } from '@/components/Button'
import { useAuth } from '@/hooks/useAuth'
```

---

## Conventions (DO / DON'T)

- **DO**: Use `strict: true`; interfaces for props and data; `@/` alias; explicit types for API/handlers when helpful.
- **DON'T**: Use `any` (prefer `unknown`); use `@ts-ignore` without fixing; use relative paths for `src/` when alias exists; disable strict options without reason.
