import { HydrationBoundary } from "@tanstack/react-query";
import type { Thread } from "@/types/forum";
import type { Route } from "./+types/_forum_thread.forum.thread.$threadId.$pageNumber";
import { getQueryClient } from "@/providers/query/queryProvider";

export const loader = ({ request, params }: Route.LoaderArgs) =>
  prefetchQueryDehydrated<Thread>(
    request,
    `/thread/${params.threadId}?page=${params.pageNumber}&pageSize=10`,
  );

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  await getQueryClient().prefetchQuery(
    bbQueryOptions<Thread>(
      `/thread/${params.threadId}?page=${params.pageNumber}&pageSize=10`,
    ),
  );
}

export default function ForumThreadPage({
  loaderData,
  params,
}: Route.ComponentProps) {
  const { threadId, pageNumber } = params;
  const currentPage = parseInt(pageNumber!);
  const { data: thread } = useBBQuery<Thread>(
    `/thread/${threadId}?page=${currentPage}&pageSize=10`,
  );
  return (
    <HydrationBoundary state={loaderData?.dehydratedState}>
      <ForumThread pageNumber={pageNumber!} thread={thread!} />
    </HydrationBoundary>
  );
}
