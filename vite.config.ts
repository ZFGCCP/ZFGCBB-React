import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import linaria from "@wyw-in-js/vite";

// https://vitejs.dev/config/
export default defineConfig({
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
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules"))
            return id
              .toString()
              .split("node_modules/")[1]!
              .split("/")[0]!
              .toString();
        },
      },
    },
  },
});
