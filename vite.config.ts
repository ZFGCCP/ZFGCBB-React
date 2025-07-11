import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generateImagePaths } from "./vite/plugins/vite-plugin-generate-image-paths";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const srcDirectory = resolve(__dirname, "src");

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    base: process.env["BASE_URL"] ?? "/",
    plugins: [reactRouter(), generateImagePaths()],
    envPrefix: ["REACT_", "VITE_", "BASE_", "PROD"],
    build: {
      target: "esnext",
    },
    server: {
      allowedHosts: [".zfgc.com"],
    },
    resolve: {
      alias: {
        "@": srcDirectory,
        "~": srcDirectory,
      },
    },
    ssr: {
      // Fixes build for styled-components.
      noExternal: ["styled-components"],
    },
  };
});
