import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import react from "@vitejs/plugin-react-swc";
// import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generateImagePaths } from "./vite/plugins/vite-plugin-generate-image-paths";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      plugins: [["@swc/plugin-styled-components", {}]],
    }),
    reactRouter(),

    generateImagePaths(),
  ],
  envPrefix: ["REACT_", "VITE_"],
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
