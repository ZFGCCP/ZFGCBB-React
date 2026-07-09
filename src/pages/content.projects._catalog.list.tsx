import { HydrationBoundary } from "@tanstack/react-query";
import type { Paged, Project } from "@/types/content";
import { getQueryClient } from "@/providers/query/queryProvider";
import type { Route } from "./+types/content.projects._catalog.list";

function listUrls(request: Request): `/${string}`[] {
  const params = new URL(request.url).searchParams;
  return [
    catalogListUrl(projectCatalog.api, projectCatalog.params, params),
    `${projectCatalog.api}/facets`,
  ];
}

export const loader = ({ request }: Route.LoaderArgs) =>
  prefetchQueryDehydrated<Paged<Project>>(request, listUrls(request));

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  await Promise.all(
    listUrls(request).map((url) =>
      getQueryClient().prefetchQuery(bbQueryOptions<Paged<Project>>(url)),
    ),
  );
}

export default function ProjectsListPage({ loaderData }: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData?.dehydratedState}>
      <CmsCatalogBrowse descriptor={projectCatalog} />
    </HydrationBoundary>
  );
}
