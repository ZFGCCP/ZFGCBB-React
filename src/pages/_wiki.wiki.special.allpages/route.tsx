import type { Route } from "./+types/route";

export const loader = ({ request }: Route.LoaderArgs) =>
  prefetchQueryDehydrated(request, [
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
