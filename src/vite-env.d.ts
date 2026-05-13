/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEB3FORMS_ACCESS_KEY?: string
  readonly VITE_WEB3FORMS_REPLY_EMAIL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
