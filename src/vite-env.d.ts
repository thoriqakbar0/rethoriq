/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AGENTATION_ENDPOINT?: string
  readonly VITE_ENABLE_AGENTATION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
