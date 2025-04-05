/// <reference types="vite/client" />
/// <reference types="../build/types/image-paths.d.ts" />

interface ImportMetaEnv {
  readonly REACT_ZFGBB_API_URL: `${string}://${string}:${string}/${string}/`;
  // Vite base url
  readonly BASE_URL: `/${string}/`;
}
