import type { Preset } from "@react-router/dev/config";

export function presetSpa(): Preset {
  return {
    name: "preset-spa",
    reactRouterConfig: ({ reactRouterUserConfig: config }) => ({
      ...config,
      ssr: false,
      serverModuleFormat: "esm",
      subResourceIntegrity: true,
      splitRouteModules: true,
      future: {
        unstable_optimizeDeps: true,
      },
    }),
  };
}
