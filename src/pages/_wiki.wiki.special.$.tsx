import { HydrationBoundary } from "@tanstack/react-query";
import { Navigate } from "react-router";
import type { Route } from "./+types/_wiki.wiki.special.$";
import { prefetchQueryDehydrated } from "@/shared/http/ssrPrefetch";
import { WikiShell } from "@/components/wiki/WikiShell";
import { UnknownSpecialPage } from "@/components/wiki/WikiSpecialPages";
import type { RoutePaths } from "@/components/common/BBLink";
import type { WikiPage } from "@/types/content";

export const loader = ({ request, params }: Route.LoaderArgs) =>
  prefetchQueryDehydrated(request, [
    "/wiki/meta/config",
    `/wiki/Special:${params["*"] ?? ""}`,
  ]);

function SpecialResolver({ name }: { name: string }) {
  const { data: page, isPending } = useBBQuery<WikiPage>(
    `/wiki/Special:${name}`,
  );
  if (page?.redirectTo) {
    const target = page.redirectTo.startsWith("/")
      ? page.redirectTo
      : `/wiki/${page.redirectTo}`;
    return <Navigate to={target as RoutePaths} replace />;
  }
  return (
    <WikiShell>
      {isPending ? null : <UnknownSpecialPage name={name} />}
    </WikiShell>
  );
}

export default function SpecialUnknownRoute({
  params,
  loaderData,
}: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData?.dehydratedState}>
      <SpecialResolver name={params["*"] ?? ""} />
    </HydrationBoundary>
  );
}
