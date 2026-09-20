/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Gumroad product id (required for products created on/after 2023-01-09). */
  readonly VITE_GUMROAD_PRODUCT_ID?: string;
  /** Dev-only: skip license gate when set to "1". Never ship in production builds. */
  readonly VITE_DEV_SKIP_LICENSE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
