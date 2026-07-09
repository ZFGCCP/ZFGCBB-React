import { HydrationBoundary } from "@tanstack/react-query";
import type { Route } from "./+types/_wiki.wiki.$";
import { getQueryClient } from "@/providers/query/queryProvider";

function wikiPageUrl(
  request: Request,
  splat: string | undefined,
): `/${string}` {
  const rev = new URL(request.url).searchParams.get("rev");
  return `/wiki/${splat ?? ""}${rev ? `?rev=${rev}` : ""}`;
}

export const loader = ({ request, params }: Route.LoaderArgs) =>
  prefetchQueryDehydrated(
    request,
    wikiPageUrl(request, params["*"]),
    WikiPageSchema,
  );

export async function clientLoader({
  request,
  params,
}: Route.ClientLoaderArgs) {
  await getQueryClient().prefetchQuery(
    bbQueryOptions(wikiPageUrl(request, params["*"]), {
      schema: WikiPageSchema,
    }),
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
