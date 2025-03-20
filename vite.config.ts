import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import linaria from "@wyw-in-js/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [linaria(), reactRouter()],
  build: {
    target: "esnext",
  },
});
