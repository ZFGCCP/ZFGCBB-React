import type { Route } from "./+types/route";

export const loader = ({ request }: Route.LoaderArgs) =>
  prefetchQueryDehydrated(request, [
    { url: "/wiki/meta/statistics", schema: WikiStatisticsSchema },
  ]);

export default function SpecialStatisticsRoute() {
  return (
    <WikiShell trail={specialTrail("Statistics")}>
      <WikiStatistics />
    </WikiShell>
  );
}
