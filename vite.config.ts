import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import linaria from "@wyw-in-js/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    linaria({
      include: ["src/**/*.{ts,tsx}"],
      babelOptions: {
        presets: [
          "@wyw-in-js/babel-preset",
          "@babel/preset-typescript",
          "@babel/preset-react",
        ],
      },
    }),
    reactRouter(),
  ],
  envPrefix: ["REACT_", "VITE_"],
  build: {
    target: "esnext",
  },
  server: {
    allowedHosts: ["zfgc.com:28080", "localhost:8080"],
  },
});
