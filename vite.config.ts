import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import linaria from "@wyw-in-js/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    linaria({
      // include: ["src/**/*.{ts,tsx}"],
      // babelOptions: {
      //   presets: ["@babel/preset-typescript", "@babel/preset-react"],
      // },
    }),
    reactRouter(),
  ],
  build: {
    target: "esnext",
  },
});
