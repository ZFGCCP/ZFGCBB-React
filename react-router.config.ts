import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src",
  ssr: false,
  basename: process.env["CI"] ? "/ZFGCBB-React/" : "/",
} satisfies Config;
