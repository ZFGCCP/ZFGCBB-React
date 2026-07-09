import { HydrationBoundary } from "@tanstack/react-query";
import type { PrefetchTarget } from "@/shared/http/ssrPrefetch";
import { getQueryClient } from "@/providers/query/queryProvider";
import type { Route } from "./+types/content.resources._catalog.list";

function listTargets(request: Request): PrefetchTarget[] {
  const params = new URL(request.url).searchParams;
  return [
    {
      url: catalogListUrl(resourceCatalog.api, resourceCatalog.params, params),
      schema: pagedSchema(ResourceSchema),
    },
    { url: `${resourceCatalog.api}/facets`, schema: ResourceFacetsSchema },
  ];
}

export const loader = ({ request }: Route.LoaderArgs) =>
  prefetchQueryDehydrated(request, listTargets(request));

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  await Promise.all(
    listTargets(request).map(({ url, schema }) =>
      getQueryClient().prefetchQuery(bbQueryOptions(url, { schema })),
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
