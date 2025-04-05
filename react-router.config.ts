import type { Config } from "@react-router/dev/config";
import { loadEnv } from "vite";

const env = loadEnv(process.env["VITE_MODE"] ?? "", process.cwd(), [
  "REACT_",
  "VITE_",
  "BASE_",
]);
export default {
  appDirectory: "src",
  ssr: false,
  basename: env["BASE_URL"] ?? "/",
  future: {
    unstable_viteEnvironmentApi: true,
    unstable_middleware: true,
    unstable_optimizeDeps: true,
    unstable_splitRouteModules: true,
    unstable_subResourceIntegrity: true,
  },
} satisfies Config;
