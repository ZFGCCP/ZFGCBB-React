import type { Config } from "@react-router/dev/config";
import { loadEnv } from "vite";
const env = loadEnv(process.env["VITE_MODE"] ?? "", process.cwd(), [
  "REACT_",
  "VITE_",
  "BASE_",
]);

// FIXME: #113 fix: remove console.warn when BASE_URL is supported for local commands when react-router/dev fixes the issue with BASE_URL when middleware is enabled.
if (
  env["BASE_URL"] &&
  env["BASE_URL"] !== "/" &&
  process.env["VITE_MODE"] !== "github-pages"
)
  console.warn(
    `Setting BASE_URL does not work for local "yarn preview" or "yarn preview:ssr" commands. Please use "yarn dev" instead.`,
  );

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
