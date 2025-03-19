import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import linaria from "@wyw-in-js/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRouter(),
    linaria({
      include: ["src/**/*.{ts,tsx}"],
      babelOptions: {
        presets: [
          "@babel/preset-typescript",
          "@babel/preset-react",
          "@wyw-in-js",
        ],
      },
      sourceMap: false,
    }),
  ],
  build: {
    target: "esnext",
  },
});
