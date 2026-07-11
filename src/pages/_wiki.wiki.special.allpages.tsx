import type { Route } from "./+types/_wiki.wiki.special.allpages";

export const loader = ({ request }: Route.LoaderArgs) =>
  prefetchQueryDehydrated(request, [
    { url: "/wiki/meta/config", schema: WikiConfigSchema },
    {
      url: wikiPagesListUrl(new URL(request.url).searchParams),
      schema: pagedSchema(WikiPageRefSchema),
    },
  ]);

export default function SpecialAllPagesRoute() {
  return (
    <WikiShell trail={specialTrail("All pages")}>
      <AllPages />
    </WikiShell>
  );
}
