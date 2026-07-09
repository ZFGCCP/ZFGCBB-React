import { HydrationBoundary } from "@tanstack/react-query";
import type { Route } from "./+types/_wiki.wiki.special.allpages";

export const loader = ({ request }: Route.LoaderArgs) =>
  prefetchQueryDehydrated(request, [
    "/wiki/meta/config",
    wikiPagesListUrl(new URL(request.url).searchParams),
  ]);

export default function SpecialAllPagesRoute({
  loaderData,
}: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData?.dehydratedState}>
      <WikiShell trail={specialTrail("All pages")}>
        <AllPages />
      </WikiShell>
    </HydrationBoundary>
  );
}
