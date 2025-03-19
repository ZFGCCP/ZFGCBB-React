import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import { pigment } from "@pigment-css/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRouter(), pigment({})],
  build: {
    target: "esnext",
  },
});
