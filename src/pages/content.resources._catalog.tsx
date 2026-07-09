import { HydrationBoundary } from "@tanstack/react-query";
import type { ResourceShowcase } from "@/types/content";
import { resourceCatalog } from "@/shared/catalogs/resourceCatalog";
import { getQueryClient } from "@/providers/query/queryProvider";
import { prefetchQueryDehydrated } from "@/shared/http/ssrPrefetch";
import type { Route } from "./+types/content.resources._catalog";

export const loader = ({ request }: Route.LoaderArgs) =>
  prefetchQueryDehydrated<ResourceShowcase>(
    request,
    `${resourceCatalog.api}/showcase`,
  );

export async function clientLoader() {
  await getQueryClient().prefetchQuery(
    bbQueryOptions<ResourceShowcase>(`${resourceCatalog.api}/showcase`),
  );
}

export default function ResourcesCatalogLayout({
  loaderData,
}: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData?.dehydratedState}>
      <CmsCatalogLayout descriptor={resourceCatalog} />
    </HydrationBoundary>
  );
}
