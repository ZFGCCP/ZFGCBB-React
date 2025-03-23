import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import wyw from "@wyw-in-js/vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    wyw({
      include: ["**/*.{ts,tsx}"],
      babelOptions: {
        presets: ["@babel/preset-typescript", "@babel/preset-react"],
      },
    }),
    ,
    reactRouter(),
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
