/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEBUG_MESSAGES: string
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
