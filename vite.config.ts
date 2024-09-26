import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import linaria from "@wyw-in-js/vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    linaria({
      include: ["**/*.{ts,tsx}"],
      babelOptions: {
        presets: ["@babel/preset-typescript", "@babel/preset-react"],
      },
    }),
  ],
  server: {
    host: true,
  },
  build: {
    target: "esnext",
  },
});
