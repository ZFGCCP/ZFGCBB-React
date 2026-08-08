import { getQueryClient } from "@/providers/query/queryProvider";
import type { Route } from "./+types/route";

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

export const handle = { breadcrumb: "Resources" };

export default function ResourcesCatalogLayout() {
  return <CmsCatalogLayout descriptor={resourceCatalog} />;
}
