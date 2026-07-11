import type { Route } from "./+types/_wiki.wiki.special.moderation";

export const loader = ({ request }: Route.LoaderArgs) =>
  prefetchQueryDehydrated(request, [
    { url: "/wiki/meta/config", schema: WikiConfigSchema },
  ]);

export default function SpecialModerationRoute() {
  return (
    <WikiShell trail={specialTrail("Moderation")}>
      <ModerationQueue />
    </WikiShell>
  );
}
