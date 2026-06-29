import { HydrationBoundary } from "@tanstack/react-query";
import type { Route } from "./+types/_wiki.wiki.special.allpages";
import { prefetchQueryDehydrated } from "@/shared/http/ssrPrefetch";
import { WikiShell } from "@/components/wiki/WikiShell";
import { specialTrail } from "@/shared/wikiTrail";
import { AllPages } from "@/components/wiki/WikiSpecialPages";

export const loader = ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const namespace = url.searchParams.get("ns") ?? "";
  const searchQuery = url.searchParams.get("q") ?? "";
  const pageNo = Number(url.searchParams.get("page") ?? "1");
  const query = new URLSearchParams({ page: String(pageNo), pageSize: "50" });
  if (namespace) query.set("namespace", namespace);
  if (searchQuery) query.set("search", searchQuery);
  return prefetchQueryDehydrated(request, [
    "/wiki/meta/config",
    `/wiki/meta/pages?${query.toString()}`,
  ]);
};

export default function SpecialAllPagesRoute({
  loaderData,
}: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData?.dehydratedState}>
      <WikiShell trail={specialTrail("All pages")}>
        <AllPages />
      </WikiShell>
    </HydrationBoundary>
  );
}
