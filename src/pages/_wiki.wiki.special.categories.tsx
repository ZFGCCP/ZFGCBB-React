import { HydrationBoundary } from "@tanstack/react-query";
import type { Route } from "./+types/_wiki.wiki.special.categories";

export const loader = ({ request }: Route.LoaderArgs) =>
  prefetchQueryDehydrated(request, [
    "/wiki/meta/config",
    "/wiki/meta/categories",
  ]);

export default function SpecialCategoriesRoute({
  loaderData,
}: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData?.dehydratedState}>
      <WikiShell trail={specialTrail("Categories")}>
        <CategoryIndex />
      </WikiShell>
    </HydrationBoundary>
  );
}
