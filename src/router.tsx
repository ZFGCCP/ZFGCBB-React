import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const ContentView = lazy(() => import("./components/contentView.component"));

const imported_routes = import.meta.glob("./pages/**/*.tsx", {
  import: "default",
});
const regex_home_route_matches = /\.\/pages\/home.tsx$/;
const regex_route_start_matches = /\.\//;
const regex_route_path_matches =
  /\/(src|pages|index|home|components|routes)|(\.tsx|\.component.tsx)$/g;
const regex_slug_matches = /\[\.{3}.+\]/;
const regex_slug_value_matches = /\[(.+)\]/;

async function lazyLoad(path: string) {
  const Component = (await imported_routes[path]()) as React.FC;
  return { Component };
}

const routes = Object.keys(imported_routes).map((route) => {
  if (regex_home_route_matches.test(route))
    return {
      element: <ContentView />,
      children: [{ path: "/", lazy: () => lazyLoad(route) }],
    };
  const path = route
    .replace(regex_route_start_matches, "/")
    .replace(regex_route_path_matches, "")
    .replace(regex_slug_matches, "*")
    .replace(regex_slug_value_matches, ":$1");

  //return { path, lazy: () => lazyLoad(route) };
  return {
    element: <ContentView />,
    children: [{ path: path, lazy: () => lazyLoad(route) }],
  };
});

export default createBrowserRouter(routes);
