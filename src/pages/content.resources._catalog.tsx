import { HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/providers/query/queryProvider";
import type { Route } from "./+types/content.resources._catalog";

export const loader = ({ request }: Route.LoaderArgs) =>
  prefetchQueryDehydrated(
    request,
    `${resourceCatalog.api}/showcase`,
    ResourceShowcaseSchema,
  );

export async function clientLoader() {
  await getQueryClient().prefetchQuery(
    bbQueryOptions(`${resourceCatalog.api}/showcase`, {
      schema: ResourceShowcaseSchema,
    }),
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
