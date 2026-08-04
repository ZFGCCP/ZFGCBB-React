import {
  defineConfig,
  loadEnv,
  mergeConfig,
  type Plugin,
  type UserConfig,
} from "vite";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import baseConfig from "@zfgc/vite-config-base";

const srcDirectory = resolve(import.meta.dirname, "src");

const DOCUMENT_HEADERS_EXPORT =
  /\n?export function headers\([^)]*\)[^{]*\{[\s\S]*?\n\}\n/u;

function dropDocumentHeadersExportFromSpaBuilds(ssrEnabled: boolean): Plugin {
  return {
    name: "zfgbb-drop-document-headers-export",
    enforce: "pre",
    transform(code, id) {
      if (ssrEnabled || !id.endsWith(`${srcDirectory}/root.tsx`)) return null;
      if (!DOCUMENT_HEADERS_EXPORT.test(code)) {
        throw new Error(
          "root.tsx no longer exports headers in the shape zfgbb-drop-document-headers-export strips; " +
            "react-router rejects a headers export when prerendering with ssr:false, so update the pattern",
        );
      }
      return { code: code.replace(DOCUMENT_HEADERS_EXPORT, "\n"), map: null };
    },
  };
}

function buildVersion(bakedInByTheImageBuild: string | undefined) {
  if (bakedInByTheImageBuild) return bakedInByTheImageBuild;
  try {
    return execFileSync("git", ["describe", "--tags", "--always", "--dirty"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "unknown";
  }
}

// https://vitejs.dev/config/
export default defineConfig((env) => {
  const envVars = loadEnv(env.mode, process.cwd(), "");
  const apiProxyTarget =
    envVars.VITE_API_PROXY_TARGET ?? "http://localhost:8080";

  return mergeConfig(baseConfig(env), {
    plugins: [
      dropDocumentHeadersExportFromSpaBuilds(
        envVars.VITE_ENABLE_SSR === "true",
      ),
    ],
    define: {
      "import.meta.env.REACT_ZFGBB_VERSION": JSON.stringify(
        buildVersion(envVars.REACT_ZFGBB_VERSION),
      ),
    },
    server: {
      allowedHosts: [".zfgc.com", ".trycloudflare.com"],
      proxy: {
        "/zfgbb": {
          target: apiProxyTarget,
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        "@": srcDirectory,
      },
    },
    optimizeDeps: {
      include: ["@tanstack/react-form"],
    },
  } satisfies UserConfig);
});
