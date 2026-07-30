import { Navigate } from "react-router";
import type { Route } from "./+types/_wiki.wiki.special.$";

export const loader = ({ request, params }: Route.LoaderArgs) =>
  prefetchQueryDehydrated(request, [
    { url: "/wiki/meta/config", schema: WikiConfigSchema },
    { url: `/wiki/Special:${params["*"] ?? ""}`, schema: WikiPageSchema },
  ]);

function SpecialResolver({ name }: { name: string }) {
  const { data: page, isPending } = useBBQuery(`/wiki/Special:${name}`, {
    schema: WikiPageSchema,
  });
  if (page?.redirectTo) {
    const target = page.redirectTo.startsWith("/")
      ? page.redirectTo
      : `/wiki/${page.redirectTo}`;
    return <Navigate to={target} replace />;
  }
  return (
    <WikiShell>
      {isPending ? null : <UnknownSpecialPage name={name} />}
    </WikiShell>
  );
}

export default function SpecialUnknownRoute({ params }: Route.ComponentProps) {
  return <SpecialResolver name={params["*"] ?? ""} />;
}
