import { defineConfig, loadEnv } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generateImagePaths } from "./vite/plugins/vite-plugin-generate-image-paths";
import tailwindcss from "@tailwindcss/vite";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ["REACT_", "VITE_", "BASE_"]);
  process.env["VITE_MODE"] = mode;

  return {
    base: env["BASE_URL"],
    plugins: [reactRouter(), tailwindcss(), generateImagePaths()],
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
  };
});
