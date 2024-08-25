/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ALCHEMY_PROVIDER_URL: string;
  readonly VITE_ALCHEMY_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
