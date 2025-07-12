import type React from "react";
import type { BoardSummary } from "../../../types/forum";
import BBLink from "../../common/bbLink.component";
import BBTable from "../../common/table/bbTable.component";

interface BoardSummaryViewProps {
  subBoards: BoardSummary[];
}

const BoardSummaryView: React.FC<BoardSummaryViewProps> = ({ subBoards }) => {
  const columns: BBTableColumn<BoardSummary>[] = [
    {
      key: "icon",
      label: "",
      className: "w-8 flex-shrink-0",
      render: () => (
        <div className="flex justify-center">
          <div className="theme-board-status" />
        </div>
      ),
    },
    {
      key: "boardInfo",
      label: "Board",
      className: "flex-1 min-w-0",
      render: (_, board) => (
        <div className="space-y-1 py-1">
          <h6 className="font-semibold">
            <BBLink to={`/forum/board/${board.boardId}/1`}>
              {board.boardName}
            </BBLink>
          </h6>

          <div className="text-sm text-muted">{board.description}</div>

          {board.childBoards && board.childBoards.length > 0 && (
            <div className="text-sm text-highlighted">
              <span className="font-medium">Child boards: </span>
              {board.childBoards.map((cb, index) => (
                <span key={cb.boardId}>
                  <BBLink to={`/forum/board/${cb.boardId}/1`}>
                    {cb.boardName}
                  </BBLink>
                  {index < board.childBoards!.length - 1 && ", "}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-4 md:hidden text-sm text-highlighted">
            <span>Threads: {board.threadCount}</span>
            <span>Posts: {board.postCount}</span>
          </div>

          <div className="md:hidden text-sm text-highlighted space-y-1">
            <div>
              <span>Last post by: </span>
              {board.latestMessageOwnerId && board.latestMessageOwnerId > 0 ? (
                <BBLink to={`/user/profile/${board.latestMessageOwnerId}`}>
                  {board.latestMessageUserName}
                </BBLink>
              ) : (
                <span>{board.latestMessageUserName}</span>
              )}
            </div>
            <div>
              in{" "}
              <BBLink to={`/forum/thread/${board.latestThreadId}/1`}>
                {board.threadName}
              </BBLink>
            </div>
            <div>on {board.latestMessageCreatedTsAsString}</div>
          </div>
        </div>
      ),
    },
    {
      key: "stats",
      label: "Stats",
      className: "w-24 flex-shrink-0 text-center",
      hideOnMobile: true,
      render: (_, board) => (
        <div className="space-y-1 text-sm">
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
      className: "w-36 flex-shrink-0",
      hideOnMobile: true,
      render: (_, board) => (
        <div className="space-y-1 text-sm">
          <div className="text-highlighted">
            <span>Last post by: </span>
            {board.latestMessageOwnerId && board.latestMessageOwnerId > 0 ? (
              <BBLink to={`/user/profile/${board.latestMessageOwnerId}`}>
                {board.latestMessageUserName}
              </BBLink>
            ) : (
              <span>{board.latestMessageUserName}</span>
            )}
          </div>
          <div className="text-highlighted">
            in{" "}
            <BBLink
              to={`/forum/thread/${board.latestThreadId}/1`}
              className="break-words"
            >
              {board.threadName}
            </BBLink>
          </div>
          <div className="text-highlighted text-ellipsis ">
            on {board.latestMessageCreatedTsAsString}
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
      rowClassName="py-2"
    />
  );
};

export default BoardSummaryView;
