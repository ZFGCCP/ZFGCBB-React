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

export const handle = { breadcrumb: "Projects" };

export default function ProjectsCatalogLayout() {
  return <CmsCatalogLayout descriptor={projectCatalog} />;
}
