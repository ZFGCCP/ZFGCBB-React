import type { Route } from "./+types/_wiki.wiki.$";
import { entityRoute } from "@/shared/http/entityLoaders";

function wikiPageUrl(
  request: Request,
  splat: string | undefined,
): `/${string}` {
  const rev = new URL(request.url).searchParams.get("rev");
  return `/wiki/${encodeWikiPath(splat ?? "")}${rev ? `?rev=${rev}` : ""}`;
}

const route = entityRoute({
  dehydrated: true,
  url: (params: Route.LoaderArgs["params"], request) =>
    wikiPageUrl(request, params["*"]),
  schema: WikiPageSchema,
  prefetch: (page, queryClient, headers) =>
    queryClient.prefetchQuery(
      reactionBatchQueryOptions("WIKI_PAGE", [page.id], headers),
    ),
});

export const loader = route.loader;
export const clientLoader = route.clientLoader;

export default function WikiPageRoute({ params }: Route.ComponentProps) {
  return (
    <WikiShell>
      <WikiContent slug={params["*"] ?? ""} />
    </WikiShell>
  );
}
