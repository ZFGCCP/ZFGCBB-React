import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

export type BBPage = {
  default: React.FC;
  layout?: React.FC;
};

// See https://vite.dev/guide/features#glob-import
const imported_pages = import.meta.glob("./pages/**/*.tsx") as Record<
  string,
  () => Promise<BBPage>
>;

async function lazyLoadPage(path: string) {
  const { default: Component, layout } = await imported_pages[path]();
  return { Component, layout };
}

async function lazyLoadPageWithLayout(path: string) {
  const { layout } = await lazyLoadPage(path);
  if (!layout)
    return import("./components/common/layouts/contentView.component");

  return { default: layout! };
}

const regexRouteMatchStartPath = /\.\//;
const regexRouteMatchComponentName =
  /\/(src|pages|index|home|components|routes)|(\.tsx|\.component.tsx)$/g;
const regexRouteMatchTripleDotSlug = /\[\.{3}.+\]/;
const regexRouteMatchSlugName = /\[(.+)\]/;

const routes = Object.keys(imported_pages).map((page) => {
  const path = page
    .replace(regexRouteMatchStartPath, "/") // replaces the ./ at the start of the path with a /
    .replace(regexRouteMatchComponentName, "") // strips the .tsx or .component.tsx, etc from the end of the path
    .replace(regexRouteMatchTripleDotSlug, "*") // replaces [...] with *
    .replace(regexRouteMatchSlugName, ":$1"); // replaces [paramName] with :paramName

  const LayoutElement = lazy(() => lazyLoadPageWithLayout(page));
  return {
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <LayoutElement />
      </Suspense>
    ),
    children: [
      {
        path: path,
        lazy: () => lazyLoadPage(page),
      },
    ],
  };
});

export default createBrowserRouter(routes);
