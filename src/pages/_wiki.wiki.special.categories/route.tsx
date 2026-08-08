import type { Route } from "./+types/route";

export const loader = ({ request }: Route.LoaderArgs) =>
  prefetchQueryDehydrated(request, [
    { url: "/wiki/meta/categories", schema: WikiCategoryCountListSchema },
  ]);

export default function SpecialCategoriesRoute() {
  return (
    <WikiShell trail={specialTrail("Categories")}>
      <CategoryIndex />
    </WikiShell>
  );
}
