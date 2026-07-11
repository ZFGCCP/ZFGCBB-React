import type { Route } from "./+types/_forum_thread.forum.thread.$threadId.$pageNumber";
import {
  type BreadcrumbHandle,
  type Crumb,
  type ThreadNavState,
} from "@/components/common/BBBreadcrumb";
import { entityRoute } from "@/shared/http/entityLoaders";

const threadUrl = (threadId: string, pageNumber: string): `/${string}` =>
  `/thread/${threadId}?page=${parsePage(pageNumber)}&pageSize=10`;

const route = entityRoute({
  url: (params: Route.LoaderArgs["params"]) =>
    threadUrl(params.threadId!, params.pageNumber!),
  schema: ThreadSchema,
  prefetch: (thread, headers) => {
    const ids = (thread.messages ?? []).map((message) => message.id);
    return ids.length > 0
      ? [reactionBatchQueryOptions("MESSAGE", ids, headers)]
      : [];
  },
});

export const loader = route.loader;
export const clientLoader = route.clientLoader;

export const handle = {
  breadcrumb: (match, ctx) => {
    const thread = match.loaderData?.entity;
    if (!thread) return "Forum";
    const fromBoardUrl = (ctx.location.state as ThreadNavState | null)
      ?.fromBoardUrl;
    const boardTo =
      typeof fromBoardUrl === "string" &&
      fromBoardUrl.startsWith(`/forum/board/${thread.boardId}/`)
        ? fromBoardUrl
        : `/forum/board/${thread.boardId}/1`;
    const crumbs: Crumb[] = [
      { label: "Forum", to: "/forum" },
      { label: thread.boardName, to: boardTo, prefetch: "intent" },
      { label: thread.threadName ?? "" },
    ];
    return crumbs;
  },
} satisfies BreadcrumbHandle<Awaited<ReturnType<typeof loader>>>;

export default function ForumThreadPage({ params }: Route.ComponentProps) {
  const { pageNumber } = params;
  return <ForumThread pageNumber={pageNumber!} />;
}
