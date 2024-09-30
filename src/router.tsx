import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

const ContentView = lazy(() => import("./components/contentView.component"));

export type BBPage = {
  default: React.FC;
  layout?: React.FC;
}

const imported_pages = import.meta.glob("./pages/**/*.tsx") as Record<string, () => Promise<BBPage>>;

const regex_route_start_matches = /\.\//;
const regex_route_path_matches =
  /\/(src|pages|index|home|components|routes)|(\.tsx|\.component.tsx)$/g;
const regex_slug_matches = /\[\.{3}.+\]/;
const regex_slug_value_matches = /\[(.+)\]/;

async function lazyLoadPage(path: string) {
  const { default: Component, layout } = (await imported_pages[path]());
  return { Component, layout };
}

async function lazyLoadPageWithLayout(path: string) {
  const { layout } = (await imported_pages[path]());
  if (!layout) return import("./components/contentView.component");

  return { default: layout! };
}

const routes = Object.keys(imported_pages).map((page) => {
  const path = page
    .replace(regex_route_start_matches, "/")
    .replace(regex_route_path_matches, "")
    .replace(regex_slug_matches, "*")
    .replace(regex_slug_value_matches, ":$1");

  const LayoutElement = lazy(() => lazyLoadPageWithLayout(page));
  return {
    element: <Suspense fallback={<div>Loading...</div>}><LayoutElement /></Suspense>,
    children: [{
      path: path, lazy: () => lazyLoadPage(page),
    }],
  };
});

export default createBrowserRouter(routes);
