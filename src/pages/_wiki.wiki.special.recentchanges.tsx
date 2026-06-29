import { HydrationBoundary } from "@tanstack/react-query";
import type { Route } from "./+types/_wiki.wiki.special.recentchanges";
import { prefetchQueryDehydrated } from "@/shared/http/ssrPrefetch";
import { WikiShell } from "@/components/wiki/WikiShell";
import { specialTrail } from "@/shared/wikiTrail";
import { RecentChanges } from "@/components/wiki/WikiSpecialPages";

export const loader = ({ request }: Route.LoaderArgs) =>
  prefetchQueryDehydrated(request, [
    "/wiki/meta/config",
    "/wiki/meta/recentchanges",
  ]);

export default function SpecialRecentChangesRoute({
  loaderData,
}: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData?.dehydratedState}>
      <WikiShell trail={specialTrail("Recent changes")}>
        <RecentChanges />
      </WikiShell>
    </HydrationBoundary>
  );
}
