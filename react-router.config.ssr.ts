import type { Preset } from "@react-router/dev/config";

export function presetSsr(): Preset {
  return {
    name: "preset-ssr",
    reactRouterConfig: ({ reactRouterUserConfig: config }) => ({
      ...config,
      ssr: true,
      serverModuleFormat: "esm",
      subResourceIntegrity: true,
      splitRouteModules: false,
      future: {
        unstable_optimizeDeps: true,
        unstable_enableNodeReadableStream: true,
      },
    }),
  };
}
