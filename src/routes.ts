import { type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

export default flatRoutes({
  rootDirectory: "./pages",
  //   ignoredRouteFiles: ["home.tsx"],
}) satisfies RouteConfig;
