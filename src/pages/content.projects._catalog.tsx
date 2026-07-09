import { HydrationBoundary } from "@tanstack/react-query";
import type { ProjectShowcase } from "@/types/content";
import { projectCatalog } from "@/components/cms/catalogs/projectCatalog";
import { getQueryClient } from "@/providers/query/queryProvider";
import { prefetchQueryDehydrated } from "@/shared/http/ssrPrefetch";
import type { Route } from "./+types/content.projects._catalog";

export const loader = ({ request }: Route.LoaderArgs) =>
  prefetchQueryDehydrated<ProjectShowcase>(
    request,
    `${projectCatalog.api}/showcase`,
  );

export async function clientLoader() {
  await getQueryClient().prefetchQuery(
    bbQueryOptions<ProjectShowcase>(`${projectCatalog.api}/showcase`),
  );
}

export default function ProjectsCatalogLayout({
  loaderData,
}: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData?.dehydratedState}>
      <CmsCatalogLayout descriptor={projectCatalog} />
    </HydrationBoundary>
  );
}
