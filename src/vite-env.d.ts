/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** GitHub Pages 等静态托管：用 hash 路由避免深链文档 404 */
  readonly VITE_HASH_ROUTER?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
