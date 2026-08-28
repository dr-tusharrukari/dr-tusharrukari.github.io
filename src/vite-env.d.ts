/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FORMSPREE_ENDPOINT?: string;
  readonly VITE_FORMSPREE_ID?: string;
  readonly VITE_WEB3FORMS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
