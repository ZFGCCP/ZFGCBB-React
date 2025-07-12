import type React from "react";
import type { BoardSummary } from "../../../types/forum";
import BBLink from "../../common/bbLink.component";
import BBTable from "../../common/tables/bbTable.component";

interface BoardSummaryViewProps {
  subBoards: BoardSummary[];
}

const BoardSummaryView: React.FC<BoardSummaryViewProps> = ({ subBoards }) => {
  const columns: BBTableColumn<BoardSummary>[] = [
    {
      key: "icon",
      label: "",
      className: "max-w-8 grow",
      render: () => <div className="theme-board-status " />,
    },
    {
      key: "boardInfo",
      label: "Board",
      className: "m-w-0 grow overflow-hidden",
      render: (_, board) => (
        <div className=" text-ellipsis whitespace-nowrap">
          <h6 className="font-semibold md:text-left text-right">
            <BBLink to={`/forum/board/${board.boardId}/1`} prefetch="intent">
              {board.boardName}
            </BBLink>
          </h6>

          <div className="text-sm text-muted">{board.description}</div>

          {board.childBoards && board.childBoards.length > 0 && (
            <div className="text-sm text-highlighted">
              <span className="font-medium">Child boards: </span>
              {board.childBoards.map((cb, index) => (
                <span key={cb.boardId}>
                  <BBLink to={`/forum/board/${cb.boardId}/1`} prefetch="intent">
                    {cb.boardName}
                  </BBLink>
                  {index < board.childBoards!.length - 1 && ", "}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-col md:hidden text-sm text-highlighted space-y-1">
            <div className="flex flex-row gap-4 justify-end text-highlighted">
              <span>Threads: {board.threadCount ?? 0}</span>
              <span>Posts: {board.postCount ?? 0}</span>
            </div>
            <div className="flex flex-row gap-4 justify-end text-highlighted">
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
            <div className="flex flex-row gap-4 justify-end text-highlighted">
              {board.threadName ? (
                <>
                  in{" "}
                  <BBLink
                    to={`/forum/thread/${board.latestThreadId}/1`}
                    prefetch="intent"
                  >
                    {board.threadName}
                  </BBLink>
                </>
              ) : null}
            </div>
            <div className="flex flex-row grow gap-4 justify-end">
              {board.latestMessageCreatedTsAsString ? (
                <>on {board.latestMessageCreatedTsAsString}</>
              ) : null}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "stats",
      label: "Stats",
      className: "grow ",
      hideOnMobile: true,
      render: (_, board) => (
        <div className="space-y-1 text-sm text-right">
          <div className="text-highlighted">Threads</div>
          <div className="font-medium">{board.threadCount}</div>
          <div className="text-highlighted">Posts</div>
          <div className="font-medium">{board.postCount}</div>
        </div>
      ),
    },
    {
      key: "lastPost",
      label: "Last Post",
      className: "w-72 shrink-0",
      hideOnMobile: true,
      render: (_, board) => (
        <div className="space-y-1 text-sm">
          <div className="text-highlighted">
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
          <div className="text-highlighted overflow-hidden text-ellipsis whitespace-nowrap">
            {board.threadName ? (
              <>
                in{" "}
                <BBLink to={`/forum/thread/${board.latestThreadId}/1`}>
                  {board.threadName}
                </BBLink>
              </>
            ) : null}
          </div>
          <div className="text-highlighted">
            {board.latestMessageCreatedTsAsString ? (
              <>on {board.latestMessageCreatedTsAsString}</>
            ) : null}
          </div>
        </div>
      ),
    },
  ];

  return (
    <BBTable
      columns={columns}
      data={subBoards}
      emptyMessage="No boards available"
      showHeader={false}
      rowClassName="py-2 px-4 "
    />
  );
};

export default BoardSummaryView;
