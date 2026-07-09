import { HydrationBoundary } from "@tanstack/react-query";
import type { BBTableColumn } from "@/components/common/layout/BBTable";
import type { Board, ThreadSummary } from "../types/forum";
import type { Route } from "./+types/_forum_board.forum.board.$boardId.$pageNumber";
import { getQueryClient } from "@/providers/query/queryProvider";
import { type Crumb } from "@/components/common/BBBreadcrumb";

export const loader = ({ request, params }: Route.LoaderArgs) =>
  prefetchQueryDehydrated(
    request,
    `/board/${params.boardId}?page=${params.pageNumber}`,
    BoardSchema,
  );

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  await getQueryClient().prefetchQuery(
    bbQueryOptions(`/board/${params.boardId}?page=${params.pageNumber}`, {
      schema: BoardSchema,
    }),
  );
}

function BoardTablePaginatorComponent({
  board,
  onPageChange,
  isLoading,
  currentPage,
  maxPageCount,
  className = "",
  // skeletonContainerClassName = "",
  // skeletonClassName = "",
}: {
  board?: Board;
  isLoading: boolean;
  className?: string;
  skeletonContainerClassName?: string;
  skeletonClassName?: string;
} & Omit<BBPaginatorProps, "numPages">) {
  return (
    <div className="flex justify-left scrollbar-thin">
      {
        <BBPaginator
          numPages={!isLoading && board ? board.pageCount : currentPage}
          currentPage={currentPage}
          maxPageCount={maxPageCount}
          onPageChange={onPageChange}
          className={className}
        />
      }
    </div>
  );
}

function BoardTableComponent({ board }: { board: Board }) {
  const columns: BBTableColumn<ThreadSummary>[] = [
    {
      key: "icon",
      label: "",
      className: "w-12 shrink-0",
      render: (_, thread) => (
        <div className="flex flex-col items-center gap-2">
          {thread.pinnedFlag ? (
            <BBIcon name="sticky" />
          ) : (
            <BBIcon name="topic" />
          )}
          <div className="block sm:hidden">
            <BBIcon name="unread" />
          </div>
        </div>
      ),
    },
    {
      key: "postIndicator",
      label: "",
      className: "w-8 shrink-0",
      hideOnMobile: true,
      render: () => (
        <div className="flex justify-center">
          <BBIcon name="unread" />
        </div>
      ),
    },
    {
      key: "subject",
      label: "Subject",
      className: "min-w-0 grow",
      render: (_, thread) => (
        <div className="space-y-2 p-1">
          <h6 className="font-semibold flex items-center gap-2">
            <BBLink to={`/forum/thread/${thread.id}/1`} prefetch="intent">
              {thread.threadName}
            </BBLink>
          </h6>

          <div className="block md:hidden text-sm text-dimmed">
            <span>Author: </span>
            {thread.createdUserId != null && thread.createdUserId > 0 ? (
              <BBLink
                to={`/user/profile/${thread.createdUser?.id}`}
                prefetch="intent"
              >
                {thread.createdUser?.displayName}
              </BBLink>
            ) : (
              <span>{thread.createdUser?.displayName}</span>
            )}
          </div>

          <div className="flex content-center  gap-4 md:hidden text-sm text-highlighted">
            <span>Replies: {thread.postCount}</span>
            <span>Views: {thread.viewCount}</span>
          </div>

          <div className="block md:hidden text-sm text-highlighted">
            Latest Post by:{" "}
            <BBLink
              to={`/user/profile/${thread.latestMessage?.ownerId}`}
              prefetch="intent"
            >
              {thread.latestMessage?.ownerName}
            </BBLink>
          </div>
        </div>
      ),
    },
    {
      key: "author",
      label: "Author",
      className: "w-24 shrink-0 text-center text-ellipsis overflow-hidden",
      hideOnMobile: true,
      hideOnTablet: true,
      render: (_, thread) =>
        thread.createdUserId != null && thread.createdUserId > 0 ? (
          <BBLink
            to={`/user/profile/${thread.createdUser?.id}`}
            prefetch="intent"
          >
            {thread.createdUser?.displayName}
          </BBLink>
        ) : (
          <span>{thread.createdUser?.displayName}</span>
        ),
    },
    {
      key: "replies",
      label: "Replies",
      className: "w-20 shrink-0 text-center hidden lg:block",
      hideOnMobile: false,
      hideOnTablet: false,
      render: (_, thread) => (
        <span className="text-dimmed">{thread.postCount}</span>
      ),
    },
    {
      key: "views",
      label: "Views",
      className: "w-20 shrink-0 text-center",
      hideOnMobile: true,
      hideOnTablet: true,
      render: (_, thread) => (
        <span className="text-dimmed">{thread.viewCount}</span>
      ),
    },
    {
      key: "stats",
      label: "Stats",
      className: "w-24 shrink-0 text-center hidden md:block lg:hidden",
      render: (_, thread) => (
        <div className="space-y-1">
          <div className="text-sm text-highlighted">
            Replies: {thread.postCount}
          </div>
          <div className="text-sm text-highlighted">
            Views: {thread.viewCount}
          </div>
        </div>
      ),
    },
    {
      key: "lastPost",
      label: "Latest Post",
      className: "w-48 shrink-0",
      hideOnMobile: true,
      render: (_, thread) => (
        <div className="space-y-1 text-sm">
          <div className="text-sm text-highlighted">
            <span>by </span>
            {thread.latestMessage?.ownerId &&
            thread.latestMessage.ownerId > 0 ? (
              <BBLink
                to={`/user/profile/${thread.latestMessage?.ownerId}`}
                prefetch="intent"
              >
                {thread.latestMessage?.ownerName}
              </BBLink>
            ) : (
              <span>{thread.latestMessage?.ownerName}</span>
            )}
          </div>
          <div className="text-sm text-dimmed">
            {thread.latestMessage?.lastPostTsAsString ? (
              <>
                <span>on </span>
                <BBDate dateStr={thread.latestMessage.lastPostTsAsString} />
              </>
            ) : null}
          </div>
        </div>
      ),
    },
  ];

  const allThreads = [
    ...(board.stickyThreads || []),
    ...(board.unStickyThreads || []),
  ];

  return (
    <BBTable
      columns={columns}
      data={allThreads}
      emptyMessage="No threads available"
      headerClassName="hidden md:block"
      rowOuterFlexOptions={{ gap: "gap-4" }}
    />
  );
}

function BoardContainer() {
  const navigate = useNavigate();
  const { boardId: boardIdParam, pageNumber: pageNumberParam } = useParams();
  const boardId = parseInt(boardIdParam!);
  const pageNumber = parseInt(pageNumberParam!);

  const query = useBBQuery(`/board/${boardId}?page=${pageNumber}`, {
    retry: 0,
    schema: BoardSchema,
  });

  const { data: siteInfo } = useSiteInfo();
  const siteName = siteInfo?.siteName ?? "Loading...";

  const loadNewPage = (currentPageNumber: number) => {
    navigate(`/forum/board/${boardId}/${currentPageNumber}`);
  };

  if (query.isError)
    return (
      <BBError
        error={query.error ?? undefined}
        onRetry={() => void query.refetch()}
      />
    );
  if (!query.data) return <BBSkeleton className="h-40 w-full rounded" />;
  const board = query.data;
  const boardName = board.boardName;

  const breadcrumbs: Crumb[] = [
    { label: siteName, to: "/forum", prefetch: "render" },
    { label: boardName },
  ];

  return (
    <>
      {board.childBoards && board.childBoards.length > 0 ? (
        <BBWidget widgetTitle={"Child Boards"}>
          <BoardSummaryView subBoards={board.childBoards} />
        </BBWidget>
      ) : null}

      <BBBreadcrumb crumbs={breadcrumbs} />

      <BoardTablePaginatorComponent
        board={board}
        onPageChange={loadNewPage}
        isLoading={false}
        currentPage={Number(pageNumber)}
        className="bg-accented p-4 my-4"
        skeletonContainerClassName="bg-accented p-4 mb-4 w-full"
        skeletonClassName="p-8 size-full"
      />

      <BBWidget widgetTitle={boardName}>
        <BoardTableComponent board={board} />
        <BoardTablePaginatorComponent
          board={board}
          onPageChange={loadNewPage}
          isLoading={false}
          currentPage={Number(pageNumber)}
          className="bg-accented p-4"
          skeletonContainerClassName="w-full p-4 mb-2"
          skeletonClassName="p-8 size-full"
        />
      </BBWidget>

      <BBBreadcrumb crumbs={breadcrumbs} />
    </>
  );
}

export default function BoardRoute({ loaderData }: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData?.dehydratedState}>
      <BoardContainer />
    </HydrationBoundary>
  );
}
