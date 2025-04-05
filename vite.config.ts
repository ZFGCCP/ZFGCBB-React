import { defineConfig, loadEnv } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import react from "@vitejs/plugin-react-swc";
// import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generateImagePaths } from "./vite/plugins/vite-plugin-generate-image-paths";

const env = loadEnv(process.env["VITE_MODE"] ?? "", process.cwd(), [
  "REACT_",
  "VITE_",
  "BASE_",
]);
const __dirname = fileURLToPath(new URL(".", import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  base: env["BASE_URL"],
  plugins: [
    react({
      plugins: [["@swc/plugin-styled-components", {}]],
    }),
    reactRouter(),
    generateImagePaths(),
  ],
  envPrefix: ["REACT_", "VITE_", "BASE_", "PROD"],
  build: {
    target: "esnext",
  },
  server: {
    allowedHosts: ["zfgc.com:28080", "localhost:8080"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "~": resolve(__dirname, "src"),
    },
  },
});
