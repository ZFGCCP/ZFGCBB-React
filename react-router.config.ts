import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src",
  ssr: false,
  basename: process.env["CI"]
    ? process.env["VITE_BASE_URI"]
    : process.env["GITHUB_PAGES"]
      ? (process.env["VITE_BASE_URI"] ?? "/ZFGCBB-React/")
      : "/",
} satisfies Config;
