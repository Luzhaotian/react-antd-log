/// <reference types="vite/client" />

/** 与 package.json version 同步，见 vite.config.ts define */
declare const __APP_VERSION__: string

interface ImportMetaEnv {
  /** 部署子路径，如 /react-antd-log/；本地开发一般留空由 Vite base 处理 */
  readonly VITE_BASE_PATH?: string
  /** GitHub Pages 等静态托管：用 hash 路由避免深链文档 404 */
  readonly VITE_HASH_ROUTER?: string
  /** 可选：覆盖展示用版本号（默认用 package.json） */
  readonly VITE_APP_VERSION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
