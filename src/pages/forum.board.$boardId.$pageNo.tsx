import type React from "react";
import { Suspense, useContext, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import BBLink from "../components/common/bbLink.component";
import BBPaginator, {
  type BBPaginatorProps,
} from "../components/common/paginator/bbPaginator.component";
import BBTable from "../components/common/tables/bbTable.component";
import Widget from "../components/common/widgets/widget.component";
import BoardSummaryView from "../components/forum/boards/boardSummary.component";
import { useBBQuery } from "../hooks/useBBQuery";
import { ThemeContext } from "../providers/theme/themeProvider";
import type { Board, Thread } from "../types/forum";
import type { Theme } from "../types/theme";
import BBImage from "@/components/common/bbImage.component";
import Skeleton from "@/components/common/skeleton.component";

function BoardTablePaginatorComponent({
  board,
  onPageChange,
  isLoading,
  currentPage,
  maxPageCount,
}: {
  board?: Board;
  isLoading: boolean;
} & Omit<BBPaginatorProps, "numPages">) {
  return (
    <div className="flex justify-start">
      {!isLoading && board ? (
        <BBPaginator
          numPages={board.pageCount}
          currentPage={currentPage}
          maxPageCount={maxPageCount}
          onPageChange={onPageChange}
        />
      ) : (
        <Skeleton />
      )}
    </div>
  );
}

function BoardTableHeaderComponent({
  theme,
}: {
  board?: Board;
  theme: Theme;
  isLoading?: boolean;
}) {
  return (
    <thead>
      <tr className="table-row bg-black text-white text-xs">
        <th></th>
        <th className="hidden sm:table-cell"></th>
        <th>Subject</th>
        <th className="hidden md:table-cell">Author</th>
        <th className="hidden lg:table-cell">Replies</th>
        <th className="hidden lg:table-cell">Views</th>
        <th className="hidden md:table-cell lg:hidden"></th>
        <th className="hidden md:table-cell">Latest Post</th>
      </tr>
      <tr className="sub-row">
        <th colSpan={7}></th>
      </tr>
    </thead>
  );
}

function BoardTableBodyComponent({
  board,
  theme,
}: {
  board?: Board;
  theme: Theme;
  isLoading?: boolean;
}) {
  return (
    <tbody>
      <Suspense>
        {board?.unStickyThreads?.map((thread) => {
          return (
            <tr
              key={`${thread.id}`}
              className="table-row body bg-white text-sm"
            >
              <td>
                <div>
                  <BBImage
                    src="themes/midnight/images/topic/normal_post.gif"
                    alt="FIXME: add proper alt text"
                  />
                </div>
                <div className="block sm:hidden mt-3">
                  <BBImage
                    src="themes/midnight/images/post/xx.gif"
                    alt="FIXME: add proper alt text"
                  />
                </div>
              </td>
              <td className="hidden sm:table-cell">
                <BBImage
                  src="themes/midnight/images/post/xx.gif"
                  alt="FIXME: add proper alt text"
                />
              </td>
              <td>
                <BBLink to={`/forum/thread/${thread.id}/1`}>
                  {thread.threadName}
                </BBLink>
                <div className="text-xs block md:hidden">
                  <span>Author: </span>
                  {thread.createdUserId > 0 ? (
                    <BBLink to={`/user/profile/${thread.createdUser?.id}`}>
                      {thread.createdUser?.displayName}
                    </BBLink>
                  ) : (
                    <span>{thread.createdUser?.displayName}</span>
                  )}
                </div>
                <div className="text-xs block md:hidden">
                  <span>Replies: {thread.postCount.toString()}</span>
                  <span className="ml-2">
                    Views: {thread.viewCount.toString()}
                  </span>
                </div>
                <div className="text-xs block md:hidden">
                  Latest Post by: {thread.latestMessage?.ownerName}
                </div>
              </td>
              <td className="hidden md:table-cell">
                {thread.createdUserId > 0 ? (
                  <BBLink to={`/user/profile/${thread.createdUser?.id}`}>
                    {thread.createdUser?.displayName}
                  </BBLink>
                ) : (
                  <span>{thread.createdUser?.displayName}</span>
                )}
              </td>
              <td className="hidden lg:table-cell">
                {thread.postCount.toString()}
              </td>
              <td className="hidden lg:table-cell">
                {thread.viewCount.toString()}
              </td>
              <td className="hidden md:table-cell lg:hidden">
                <div className="text-xs">
                  Replies: {thread.postCount.toString()}
                </div>
                <div className="text-xs">
                  Views: {thread.viewCount.toString()}
                </div>
              </td>
              <td className="hidden md:table-cell">
                <div className="text-xs">
                  <span>by </span>
                  {thread.latestMessage?.ownerId &&
                  thread.latestMessage.ownerId > 0 ? (
                    <BBLink
                      to={`/user/profile/${thread.latestMessage?.ownerId}`}
                    >
                      {thread.latestMessage?.ownerName}
                    </BBLink>
                  ) : (
                    <span>{thread.latestMessage?.ownerName}</span>
                  )}
                </div>
                <div className="text-xs">
                  on {thread.latestMessage?.lastPostTsAsString}
                </div>
              </td>
            </tr>
          );
        })}
      </Suspense>
    </tbody>
  );
}

function BoardTableComponent({
  board,
  theme,
  isLoading,
}: {
  board?: Board;
  theme: Theme;
  isLoading?: boolean;
}) {
  return isLoading && !board ? (
    <Skeleton />
  ) : (
    <BBTable>
      <BoardTableHeaderComponent theme={theme} />
      <BoardTableBodyComponent board={board} theme={theme} />
    </BBTable>
  );
}

const BoardContainer: React.FC = () => {
  const navigate = useNavigate();
  const { boardId, pageNo } = useParams();
  const { currentTheme } = useContext(ThemeContext);
  const { data: board, isLoading } = useBBQuery<Board>(
    `/board/${boardId}?pageNo=${pageNo}`,
    0,
    0,
  );

  const boardName = useMemo(() => {
    return board?.boardName ?? "Loading...";
  }, [board]);

  const footer = useMemo(() => {
    return [
      {
        label: "New Thread",
        callback: () => {},
      },
      {
        label: "New Poll",
        callback: () => {},
      },
      {
        label: "Subscribe",
        callback: () => {},
      },
      {
        label: "Mark Read",
        callback: () => {},
      },
    ];
  }, [board]);

  const loadNewPage = (currentPageNumber: number) => {
    navigate(`/forum/board/${boardId}/${currentPageNumber}`);
  };

  return (
    <>
      {!isLoading &&
        board &&
        board.childBoards &&
        board?.childBoards?.length > 0 && (
          <Widget widgetTitle={"Child Boards"}>
            <BoardSummaryView subBoards={board.childBoards} />
          </Widget>
        )}

      <div className="my-3">
        <div className="flex gap-2">
          <BBLink to="/forum">ZFGC.com</BBLink>
          <span>&gt;&gt;</span>
          <span>{boardName}</span>
        </div>
      </div>

      <Widget widgetTitle={boardName}>
        <BoardTableComponent
          board={board}
          theme={currentTheme}
          isLoading={isLoading}
        />
        <div className="bg-footerColor py-2">
          <BoardTablePaginatorComponent
            board={board}
            onPageChange={loadNewPage}
            isLoading={isLoading}
            currentPage={Number(pageNo)}
          />
        </div>
      </Widget>
    </>
  );
};

export default BoardContainer;
