import type { PrefetchTarget } from "@/shared/http/ssrPrefetch";
import { getQueryClient } from "@/providers/query/queryProvider";
import type { Route } from "./+types/content.projects._catalog.list";

function listTargets(request: Request): PrefetchTarget[] {
  const params = new URL(request.url).searchParams;
  return [
    {
      url: catalogListUrl(projectCatalog.api, projectCatalog.params, params),
      schema: pagedSchema(ProjectSchema),
    },
    { url: `${projectCatalog.api}/facets`, schema: ProjectFacetsSchema },
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

export default function ProjectsListPage() {
  return <CmsCatalogBrowse descriptor={projectCatalog} />;
}
