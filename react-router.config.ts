import type { Config } from "@react-router/dev/config";
import * as v from "valibot";
import { existsSync, readdirSync, renameSync, rmdirSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import { parseArgs } from "node:util";
import { loadEnv } from "vite";
import { presetSpa } from "./react-router.config.spa.js";
import { presetSsr } from "./react-router.config.ssr.js";

const { mode } = parseArgs({
  strict: false,
  options: {
    mode: { type: "string", default: "" },
  },
  allowPositionals: true,
}).values;

const env = loadEnv(`${mode}`, process.cwd(), ["REACT_", "VITE_"]);
const ssrEnabled = env["VITE_ENABLE_SSR"] === "true";

const nonPrerenderablePaths = new Set(["/content"]);

const prerenderApiUrl = (env["REACT_ZFGBB_API_URL"] ?? "").replace(/\/+$/u, "");

const searchAndSpecialStubs = ["/search/data", "/wiki/special/steve"];

const PagedSlugsSchema = v.looseObject({
  items: v.optional(v.array(v.looseObject({ slug: v.optional(v.string()) }))),
  total: v.optional(v.number()),
});

const ForumSchema = v.looseObject({
  categories: v.optional(
    v.array(
      v.looseObject({
        boards: v.optional(
          v.array(
            v.looseObject({
              boardId: v.optional(v.number()),
              latestThreadId: v.optional(v.number()),
              latestMessageOwnerId: v.optional(v.number()),
            }),
          ),
        ),
      }),
    ),
  ),
});

async function fetchJson<TSchema extends v.GenericSchema>(
  path: string,
  schema: TSchema,
): Promise<v.InferOutput<TSchema>> {
  const response = await fetch(`${prerenderApiUrl}${path}`, {
    signal: AbortSignal.timeout(4000),
  });
  if (!response.ok) throw new Error(`${path} -> ${response.status}`);
  const payload: unknown = await response.json();
  return v.parse(schema, payload);
}

async function fetchAllSlugs(basePath: string) {
  const firstPage = await fetchJson(
    `${basePath}?page=1&pageSize=200`,
    PagedSlugsSchema,
  );
  const items = firstPage.items ?? [];
  const slugs: string[] = items.flatMap((item) =>
    item.slug ? [item.slug] : [],
  );
  const total = firstPage.total ?? slugs.length;
  if (items.length === 0 || slugs.length >= total) {
    return slugs;
  }

  const totalPages = Math.ceil(total / 200);
  const pagePromises: Promise<v.InferOutput<typeof PagedSlugsSchema>>[] = [];
  for (let page = 2; page <= totalPages; page += 1) {
    pagePromises.push(
      fetchJson(`${basePath}?page=${page}&pageSize=200`, PagedSlugsSchema),
    );
  }

  const pages = await Promise.all(pagePromises);
  for (const pageData of pages) {
    const pageItems = pageData.items ?? [];
    for (const item of pageItems) {
      if (item.slug) slugs.push(item.slug);
    }
  }

  return slugs;
}

async function enumerate(
  label: string,
  build: () => Promise<string[]>,
  fallback: string[],
) {
  try {
    const paths = await build();
    return paths.length > 0 ? paths : fallback;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(
      `[prerender] ${label} enumeration failed (${message}); using stub(s): ${fallback.join(", ")}`,
    );
    return fallback;
  }
}

async function enumerateDynamicRoutes() {
  const [projects, resources, wiki, forum] = await Promise.all([
    enumerate(
      "projects",
      async () =>
        (await fetchAllSlugs("/projects")).map((s) => `/content/projects/${s}`),
      ["/content/projects/steve"],
    ),
    enumerate(
      "resources",
      async () =>
        (await fetchAllSlugs("/resources")).map(
          (s) => `/content/resources/${s}`,
        ),
      ["/content/resources/steve"],
    ),
    enumerate(
      "wiki",
      async () =>
        (await fetchAllSlugs("/wiki/meta/pages")).map((s) => `/wiki/${s}`),
      ["/wiki/steve"],
    ),
    enumerate(
      "forum",
      async () => {
        const boards = (
          await fetchJson("/board/forum", ForumSchema)
        ).categories?.flatMap((category) =>
          (category.boards ?? []).filter(
            (board) => board.boardId !== null && board.boardId !== undefined,
          ),
        );
        if (!boards?.length) return [];
        const threadId = boards.find(
          (board) =>
            board.latestThreadId !== null && board.latestThreadId !== undefined,
        )?.latestThreadId;
        const ownerId = boards.find(
          (board) =>
            board.latestMessageOwnerId !== null &&
            board.latestMessageOwnerId !== undefined,
        )?.latestMessageOwnerId;
        return [
          ...boards.map((board) => `/forum/board/${board.boardId}/1`),
          `/forum/thread/${threadId ?? 0}/1`,
          `/user/profile/${ownerId ?? 0}`,
        ];
      },
      ["/forum/board/0/1", "/forum/thread/0/1", "/user/profile/0"],
    ),
  ]);
  return [
    ...projects,
    ...resources,
    ...wiki,
    ...forum,
    ...searchAndSpecialStubs,
  ];
}

function directoryDepth(directoryPath: string) {
  return directoryPath.split(sep).length;
}

function collectSubdirectoriesDeepestFirst(rootDirectory: string) {
  const subdirectories: string[] = [];
  const collectDescendants = (currentDirectory: string) => {
    for (const directoryEntry of readdirSync(currentDirectory, {
      withFileTypes: true,
    })) {
      if (!directoryEntry.isDirectory()) continue;
      const childDirectory = join(currentDirectory, directoryEntry.name);
      subdirectories.push(childDirectory);
      collectDescendants(childDirectory);
    }
  };
  collectDescendants(rootDirectory);
  return subdirectories.toSorted(
    (first, second) => directoryDepth(second) - directoryDepth(first),
  );
}

function flattenPrerenderedRouteHtml(clientDirectory: string) {
  for (const routeDirectory of collectSubdirectoriesDeepestFirst(
    clientDirectory,
  )) {
    const indexHtmlPath = join(routeDirectory, "index.html");
    if (!existsSync(indexHtmlPath)) continue;
    const flatHtmlPath = `${routeDirectory}.html`;
    renameSync(indexHtmlPath, flatHtmlPath);
    if (readdirSync(routeDirectory).length === 0) rmdirSync(routeDirectory);
  }
}

const config: Config = {
  appDirectory: "src",
  buildEnd: ({ reactRouterConfig, viteConfig }) => {
    flattenPrerenderedRouteHtml(
      resolve(viteConfig.root, reactRouterConfig.buildDirectory, "client"),
    );
  },
  prerender: async ({ getStaticPaths }) => {
    const staticPaths = getStaticPaths().filter(
      (path) => !nonPrerenderablePaths.has(path),
    );
    if (ssrEnabled) return staticPaths;
    return [...staticPaths, ...(await enumerateDynamicRoutes())];
  },

  basename: env["VITE_BASE"] ?? "/",
  routeDiscovery: { mode: "initial" },
  presets: [ssrEnabled ? presetSsr() : presetSpa()],
};

export default config;
