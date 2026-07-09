import { HydrationBoundary } from "@tanstack/react-query";
import type { Paged, Resource } from "@/types/content";
import { getQueryClient } from "@/providers/query/queryProvider";
import type { Route } from "./+types/content.resources._catalog.list";

function listUrls(request: Request): `/${string}`[] {
  const params = new URL(request.url).searchParams;
  return [
    catalogListUrl(resourceCatalog.api, resourceCatalog.params, params),
    `${resourceCatalog.api}/facets`,
  ];
}

export const loader = ({ request }: Route.LoaderArgs) =>
  prefetchQueryDehydrated<Paged<Resource>>(request, listUrls(request));

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  await Promise.all(
    listUrls(request).map((url) =>
      getQueryClient().prefetchQuery(bbQueryOptions<Paged<Resource>>(url)),
    ),
  );
}

export default function ResourcesListPage({
  loaderData,
}: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData?.dehydratedState}>
      <CmsCatalogBrowse descriptor={resourceCatalog} />
    </HydrationBoundary>
  );
}
