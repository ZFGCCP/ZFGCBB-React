import type { Route } from "./+types/route";

export const loader = ({ request }: Route.LoaderArgs) =>
  prefetchQueryDehydrated(request, [
    { url: "/wiki/meta/recentchanges", schema: WikiRevisionRefListSchema },
  ]);

export default function SpecialRecentChangesRoute() {
  return (
    <WikiShell trail={specialTrail("Recent changes")}>
      <RecentChanges />
    </WikiShell>
  );
}
