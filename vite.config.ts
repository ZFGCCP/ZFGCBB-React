import { defineConfig, loadEnv, mergeConfig, type UserConfig } from "vite";
import { resolve } from "node:path";
import baseConfig from "@zfgc/vite-config-base";

const srcDirectory = resolve(import.meta.dirname, "src");

// https://vitejs.dev/config/
export default defineConfig((env) => {
  const envVars = loadEnv(env.mode, process.cwd(), "");
  const apiProxyTarget =
    envVars.VITE_API_PROXY_TARGET ?? "http://localhost:8080";

  return mergeConfig(baseConfig(env), {
    server: {
      allowedHosts: [".zfgc.com", ".trycloudflare.com"],
      proxy: {
        "/zfgbb": {
          target: apiProxyTarget,
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        "@": srcDirectory,
      },
    },
    optimizeDeps: {
      include: ["@tanstack/react-form"],
    },
  } satisfies UserConfig);
});
