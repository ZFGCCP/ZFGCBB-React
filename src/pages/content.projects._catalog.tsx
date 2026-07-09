import { HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/providers/query/queryProvider";
import type { Route } from "./+types/content.projects._catalog";

export const loader = ({ request }: Route.LoaderArgs) =>
  prefetchQueryDehydrated(
    request,
    `${projectCatalog.api}/showcase`,
    ProjectShowcaseSchema,
  );

export async function clientLoader() {
  await getQueryClient().prefetchQuery(
    bbQueryOptions(`${projectCatalog.api}/showcase`, {
      schema: ProjectShowcaseSchema,
    }),
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
