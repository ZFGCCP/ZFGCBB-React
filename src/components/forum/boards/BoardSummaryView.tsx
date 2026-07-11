import type { BBTableColumn } from "@/components/common/layout/BBTable";
import type { BoardSummary } from "../../../types/forum";

interface BoardSummaryViewProps {
  subBoards: BoardSummary[];
}

export default function BoardSummaryView({ subBoards }: BoardSummaryViewProps) {
  const columns = useMemo<BBTableColumn<BoardSummary>[]>(
    () => [
      {
        key: "icon",
        label: "",
        className: "max-w-8 grow",
        render: () => <BBIcon name="board" />,
      },
      {
        key: "boardInfo",
        label: "Board",
        className: "m-w-0 grow overflow-hidden",
        render: (_, board) => (
          <section>
            <h6 className="font-semibold text-left">
              <BBLink to={`/forum/board/${board.boardId}/1`} prefetch="intent">
                {board.boardName}
              </BBLink>
            </h6>

            <div className="text-sm text-muted">{board.description}</div>

            {board.childBoards && board.childBoards.length > 0 && (
              <div className="text-sm text-highlighted">
                <span className="font-medium">Child boards: </span>
                {board.childBoards.map((childBoard, index) => (
                  <span key={childBoard.boardId}>
                    <BBLink
                      to={`/forum/board/${childBoard.boardId}/1`}
                      prefetch="intent"
                    >
                      {childBoard.boardName}
                    </BBLink>
                    {index < board.childBoards!.length - 1 && ", "}
                  </span>
                ))}
              </div>
            )}

            <section className="flex flex-col sm:hidden text-sm text-highlighted space-y-1">
              <div className="flex flex-row gap-4 justify-end text-highlighted shrink-0 overflow-hidden">
                <span className="grow text-left">
                  Threads: {board.threadCount ?? 0}
                </span>
                <span className="grow text-right">
                  Posts: {board.postCount ?? 0}
                </span>
              </div>
              <div className="flex flex-row gap-4 justify-end text-highlighted shrink-0 truncate">
                {board.latestMessageOwnerId &&
                board.latestMessageOwnerId > 0 ? (
                  <>
                    <span className="grow text-left">Last post by: </span>

                    <BBLink
                      to={`/user/profile/${board.latestMessageOwnerId}`}
                      prefetch="intent"
                    >
                      {board.latestMessageUserName}
                    </BBLink>
                  </>
                ) : null}
              </div>
              <div className="flex flex-row gap-4 justify-end text-highlighted shrink-0">
                {board.threadName ? (
                  <>
                    <span className="grow text-left">in </span>
                    <BBLink
                      to={`/forum/thread/${board.latestThreadId}/1`}
                      prefetch="intent"
                      className="shrink truncate"
                    >
                      {board.threadName}
                    </BBLink>
                  </>
                ) : null}
              </div>
              <div className="flex flex-row grow gap-4 justify-end truncate">
                <span className="grow text-left">
                  {board.latestMessageCreatedTs ? "on " : null}
                </span>
                <span>
                  <BBDate dateStr={board.latestMessageCreatedTs} />
                </span>
              </div>
            </section>
          </section>
        ),
      },
      {
        key: "stats",
        label: "Stats",
        className: "shrink-0 overflow-hidden",
        hideOnMobile: true,
        render: (_, board) => (
          <section className="space-y-1 text-sm text-center">
            <div className="text-highlighted">Threads</div>
            <div className="font-medium">{board.threadCount}</div>
            <div className="text-highlighted">Posts</div>
            <div className="font-medium">{board.postCount}</div>
          </section>
        ),
      },
      {
        key: "lastPost",
        label: "Last Post",
        className: "max-w-1/4 grow w-full",
        hideOnMobile: true,
        render: (_, board) => (
          <section className="space-y-1 text-sm ">
            <div className="text-highlighted truncate">
              {board.latestMessageOwnerId && board.latestMessageOwnerId > 0 ? (
                <>
                  <span>Last post by: </span>
                  <BBLink
                    to={`/user/profile/${board.latestMessageOwnerId}`}
                    prefetch="intent"
                  >
                    {board.latestMessageUserName}
                  </BBLink>
                </>
              ) : null}
            </div>
            <div className="text-highlighted truncate">
              {board.threadName ? (
                <>
                  in{" "}
                  <BBLink to={`/forum/thread/${board.latestThreadId}/1`}>
                    {board.threadName}
                  </BBLink>
                </>
              ) : null}
            </div>
            <div className="text-highlighted truncate">
              {board.latestMessageCreatedTs ? (
                <>
                  on <BBDate dateStr={board.latestMessageCreatedTs} />
                </>
              ) : null}
            </div>
          </section>
        ),
      },
    ],
    [],
  );

  return (
    <BBTable
      columns={columns}
      data={subBoards}
      getRowKey={(board) => board.boardId}
      emptyMessage="No boards available"
      showHeader={false}
      rowClassName="py-2 px-4"
      rowOuterFlexOptions={{
        gap: "gap-4",
      }}
    />
  );
}
