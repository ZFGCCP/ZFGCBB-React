import type { Config } from "@react-router/dev/config";
import { loadEnv } from "vite";

const env = loadEnv(process.env["NODE_ENV"] ?? "", "./", ["REACT_", "VITE_"]);
export default {
  appDirectory: "src",
  ssr: false,
  basename: env["VITE_BASE_URI"] ?? "/",
} satisfies Config;
