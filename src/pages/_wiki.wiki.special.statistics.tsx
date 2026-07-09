import { HydrationBoundary } from "@tanstack/react-query";
import type { Route } from "./+types/_wiki.wiki.special.statistics";

export const loader = ({ request }: Route.LoaderArgs) =>
  prefetchQueryDehydrated(request, [
    "/wiki/meta/config",
    "/wiki/meta/statistics",
  ]);

export default function SpecialStatisticsRoute({
  loaderData,
}: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData?.dehydratedState}>
      <WikiShell trail={specialTrail("Statistics")}>
        <WikiStatistics />
      </WikiShell>
    </HydrationBoundary>
  );
}
