import { HydrationBoundary } from "@tanstack/react-query";
import type { Route } from "./+types/_forum_thread.forum.thread.$threadId.$pageNumber";
import { getQueryClient } from "@/providers/query/queryProvider";

export const loader = ({ request, params }: Route.LoaderArgs) =>
  prefetchQueryDehydrated(
    request,
    `/thread/${params.threadId}?page=${params.pageNumber}&pageSize=10`,
    ThreadSchema,
  );

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  await getQueryClient().prefetchQuery(
    bbQueryOptions(
      `/thread/${params.threadId}?page=${params.pageNumber}&pageSize=10`,
      { schema: ThreadSchema },
    ),
  );
}

export default function ForumThreadPage({
  loaderData,
  params,
}: Route.ComponentProps) {
  const { pageNumber } = params;
  return (
    <HydrationBoundary state={loaderData?.dehydratedState}>
      <ForumThread pageNumber={pageNumber!} />
    </HydrationBoundary>
  );
}
