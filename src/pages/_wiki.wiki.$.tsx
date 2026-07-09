import { HydrationBoundary } from "@tanstack/react-query";
import type { WikiPage } from "@/types/content";
import type { Route } from "./+types/_wiki.wiki.$";
import { getQueryClient } from "@/providers/query/queryProvider";

export const loader = ({ request, params }: Route.LoaderArgs) =>
  prefetchQueryDehydrated<WikiPage>(request, `/wiki/${params["*"] ?? ""}`);

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  await getQueryClient().prefetchQuery(
    bbQueryOptions<WikiPage>(`/wiki/${params["*"] ?? ""}`),
  );
}

export default function WikiPageRoute({
  loaderData,
  params,
}: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData?.dehydratedState}>
      <WikiShell>
        <WikiContent slug={params["*"] ?? ""} />
      </WikiShell>
    </HydrationBoundary>
  );
}
