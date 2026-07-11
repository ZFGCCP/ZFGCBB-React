import type { Route } from "./+types/_wiki.wiki.special.statistics";

export const loader = ({ request }: Route.LoaderArgs) =>
  prefetchQueryDehydrated(request, [
    { url: "/wiki/meta/config", schema: WikiConfigSchema },
    { url: "/wiki/meta/statistics", schema: WikiStatisticsSchema },
  ]);

export default function SpecialStatisticsRoute() {
  return (
    <WikiShell trail={specialTrail("Statistics")}>
      <WikiStatistics />
    </WikiShell>
  );
}
