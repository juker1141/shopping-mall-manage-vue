/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_HOST: string
  readonly VITE_BASE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}