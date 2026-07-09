import { HydrationBoundary } from "@tanstack/react-query";
import type { Route } from "./+types/_wiki.wiki.special.recentchanges";

export const loader = ({ request }: Route.LoaderArgs) =>
  prefetchQueryDehydrated(request, [
    { url: "/wiki/meta/config", schema: WikiConfigSchema },
    { url: "/wiki/meta/recentchanges", schema: WikiRevisionRefListSchema },
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
