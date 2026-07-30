import type { BBTableColumn } from "@/components/common/layout/BBTable";
import type { Board, ThreadSummary } from "@/types/forum";
import type { Route } from "./+types/route";
import {
  type BreadcrumbHandle,
  type Crumb,
  type ThreadNavState,
} from "@/components/common/BBBreadcrumb";

export const loader = ({ request, params }: Route.LoaderArgs) =>
  prefetchEntity(
    request,
    `/board/${params.boardId}?page=${parsePage(params.pageNumber ?? null)}`,
    BoardSchema,
  );

export function clientLoader({ params }: Route.ClientLoaderArgs) {
  return loadEntity(
    `/board/${params.boardId}?page=${parsePage(params.pageNumber ?? null)}`,
    BoardSchema,
  );
}

export const handle = {
  breadcrumb: (match) => {
    const board = match.loaderData?.entity;
    if (!board) return "Forum";
    const crumbs: Crumb[] = [
      { label: "Forum", to: "/forum" },
      { label: board.boardName },
    ];
    return crumbs;
  },
} satisfies BreadcrumbHandle<Awaited<ReturnType<typeof loader>>>;

const THREAD_ROW_FLEX_OPTIONS = { gap: "gap-4" } as const;

const getThreadRowKey = (thread: ThreadSummary) => thread.id;

const getThreadRowClassName = (thread: ThreadSummary) =>
  thread.pinnedFlag
    ? "bg-hatch-zelda-alttp-triforce-gold/5"
    : thread.lockedFlag
      ? "bg-hatch-error/10"
      : "";

function ThreadSubject({
  thread,
  fromUrl,
}: {
  thread: ThreadSummary;
  fromUrl: string;
}) {
  const navState = useMemo<ThreadNavState>(
    () => ({ fromBoardUrl: fromUrl }),
    [fromUrl],
  );

  return (
    <div className="space-y-2 p-1">
      <h6 className="font-semibold flex items-center gap-2">
        <BBLink
          to={`/forum/thread/${thread.id}/1`}
          state={navState}
          prefetch="intent"
        >
          {thread.threadName}
        </BBLink>
      </h6>

      <div className="md:hidden text-sm text-dimmed">
        <span>Author: </span>
        {thread.createdUserId !== null &&
        thread.createdUserId !== undefined &&
        thread.createdUserId > 0 ? (
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

      <div className="md:hidden text-sm text-highlighted">
        Latest Post by:{" "}
        <BBLink
          to={`/user/profile/${thread.latestMessage?.ownerId}`}
          prefetch="intent"
        >
          {thread.latestMessage?.ownerName}
        </BBLink>
      </div>
    </div>
  );
}

function BoardTableComponent({
  board,
  fromUrl,
}: {
  board: Board;
  fromUrl: string;
}) {
  const columns = useMemo<BBTableColumn<ThreadSummary>[]>(
    () => [
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
            <div className="sm:hidden">
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
          <ThreadSubject thread={thread} fromUrl={fromUrl} />
        ),
      },
      {
        key: "author",
        label: "Author",
        className: "w-24 shrink-0 text-center text-ellipsis overflow-hidden",
        hideOnMobile: true,
        hideOnTablet: true,
        render: (_, thread) =>
          thread.createdUserId !== null &&
          thread.createdUserId !== undefined &&
          thread.createdUserId > 0 ? (
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
              {thread.latestMessage?.lastPostTs ? (
                <>
                  <span>on </span>
                  <BBDate dateStr={thread.latestMessage.lastPostTs} />
                </>
              ) : null}
            </div>
          </div>
        ),
      },
    ],
    [fromUrl],
  );

  const allThreads = useMemo(
    () => [...(board.stickyThreads || []), ...(board.unStickyThreads || [])],
    [board.stickyThreads, board.unStickyThreads],
  );

  return (
    <BBTable
      columns={columns}
      data={allThreads}
      getRowKey={getThreadRowKey}
      rowClassName={getThreadRowClassName}
      emptyMessage="No threads available"
      headerClassName="hidden md:block"
      rowOuterFlexOptions={THREAD_ROW_FLEX_OPTIONS}
    />
  );
}

function BoardContainer() {
  const navigate = useNavigate();
  const { boardId: boardIdParam, pageNumber: pageNumberParam } = useParams();
  const boardId = Number(boardIdParam!);
  const pageNumber = parsePage(pageNumberParam ?? null);

  const query = useBBQuery(`/board/${boardId}?page=${pageNumber}`, {
    retry: 0,
    schema: BoardSchema,
  });

  const loadNewPage = useCallback(
    (currentPageNumber: number) => {
      void navigate(`/forum/board/${boardId}/${currentPageNumber}`);
    },
    [boardId, navigate],
  );

  return (
    <BBQueryBoundary query={query}>
      {(board) => (
        <div className="space-y-4">
          {board.childBoards && board.childBoards.length > 0 ? (
            <BBWidget widgetTitle={"Child Boards"} className="shadow-panel">
              <BoardSummaryView subBoards={board.childBoards} />
            </BBWidget>
          ) : null}

          <PaginatorBar
            numPages={board.pageCount}
            currentPage={pageNumber}
            onPageChange={loadNewPage}
          />

          <BBWidget widgetTitle={board.boardName} className="shadow-panel">
            <BoardTableComponent
              board={board}
              fromUrl={`/forum/board/${boardId}/${pageNumber}`}
            />
            <PaginatorBar
              numPages={board.pageCount}
              currentPage={pageNumber}
              onPageChange={loadNewPage}
            />
          </BBWidget>
        </div>
      )}
    </BBQueryBoundary>
  );
}

export default function BoardRoute() {
  return <BoardContainer />;
}
