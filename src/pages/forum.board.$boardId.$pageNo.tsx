import type React from "react";
import { Suspense, useMemo, type JSX } from "react";
import { useNavigate, useParams } from "react-router";
import BBLink from "../components/common/bbLink.component";
import BBPaginator, {
  type BBPaginatorProps,
} from "../components/common/paginator/bbPaginator.component";
import Widget from "../components/common/widgets/widget.component";
import BoardSummaryView from "../components/forum/boards/boardSummary.component";
import { useBBQuery } from "../hooks/useBBQuery";
import type { Board, Thread } from "../types/forum";
import Skeleton from "@/components/common/skeleton.component";
import BBFlex from "@/components/common/layout/bbFlex.component";
import BBTable from "../components/common/tables/bbTable.component";

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
    <div className="flex justify-left scrollbar-thin">
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

function BoardTableComponent({
  board,
  isLoading,
}: {
  board?: Board;
  isLoading?: boolean;
}) {
  const columns: BBTableColumn<Thread>[] = [
    {
      key: "icon",
      label: "",
      className: "w-12 flex-shrink-0",
      render: () => (
        <div className="flex flex-col items-center gap-2">
          <div className="theme-topic-normal" />
          <div className="block sm:hidden">
            <div className="theme-post-indicator" />
          </div>
        </div>
      ),
    },
    {
      key: "postIndicator",
      label: "",
      className: "w-8 flex-shrink-0",
      hideOnMobile: true,
      render: () => (
        <div className="flex justify-center">
          <div className="theme-post-indicator" />
        </div>
      ),
    },
    {
      key: "subject",
      label: "Subject",
      className: "flex-1 content-center min-w-0",
      render: (_, thread) => (
        <div className="space-y-2">
          <h6 className="font-semibold">
            <BBLink to={`/forum/thread/${thread.id}/1`} prefetch="intent">
              {thread.threadName}
            </BBLink>
          </h6>

          <div className="block md:hidden text-sm text-muted">
            <span>Author: </span>
            {thread.createdUserId > 0 ? (
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
            <span>Replies: {thread.postCount.toString()}</span>
            <span>Views: {thread.viewCount.toString()}</span>
          </div>

          <div className="block md:hidden text-sm text-highlighted">
            Latest Post by: {thread.latestMessage?.ownerName}
          </div>
        </div>
      ),
    },
    {
      key: "author",
      label: "Author",
      className: "w-24 flex-shrink-0 text-center text-ellipsis overflow-hidden",
      hideOnMobile: true,
      render: (_, thread) =>
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
      className: "w-20 flex-shrink-0 text-center",
      hideOnMobile: true,
      hideOnTablet: true,
      render: (_, thread) => (
        <span className="text-dimmed">{thread.postCount.toString()}</span>
      ),
    },
    {
      key: "views",
      label: "Views",
      className: "w-20 flex-shrink-0 text-center",
      hideOnMobile: true,
      hideOnTablet: true,
      render: (_, thread) => (
        <span className="text-dimmed">{thread.viewCount.toString()}</span>
      ),
    },
    {
      key: "stats",
      label: "Stats",
      className: "w-24 flex-shrink-0 text-center hidden md:block lg:hidden",
      render: (_, thread) => (
        <div className="space-y-1">
          <div className="text-sm text-highlighted">
            Replies: {thread.postCount.toString()}
          </div>
          <div className="text-sm text-highlighted">
            Views: {thread.viewCount.toString()}
          </div>
        </div>
      ),
    },
    {
      key: "lastPost",
      label: "Latest Post",
      className: "w-48 flex-shrink-0",
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
            on {thread.latestMessage?.lastPostTsAsString}
          </div>
        </div>
      ),
    },
  ];

  return isLoading && !board ? (
    <Skeleton />
  ) : (
    <BBTable
      columns={columns}
      data={board?.unStickyThreads || []}
      emptyMessage="No threads available"
    />
  );
}

const BoardContainer: React.FC = () => {
  const navigate = useNavigate();
  const { boardId: boardIdParam, pageNo: pageNoParam } = useParams();
  const boardId = parseInt(boardIdParam!);
  const pageNo = parseInt(pageNoParam!);

  const { data: board, isLoading } = useBBQuery<Board>(
    `/board/${boardId}?pageNo=${pageNo}`,
    0,
    0,
  );

  const boardName = useMemo(() => {
    return board?.boardName ?? "Loading...";
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

      {!isLoading && (
        <div className="my-3">
          <BBFlex gap="gap-2" className="">
            <BBLink to="/forum" prefetch="render">
              ZFGC.com
            </BBLink>
            <span>&gt;&gt;</span>
            <span>{boardName}</span>
          </BBFlex>
        </div>
      )}

      <div className="bg-accented p-4 mb-4">
        <BoardTablePaginatorComponent
          board={board}
          onPageChange={loadNewPage}
          isLoading={isLoading}
          currentPage={Number(pageNo)}
        />
      </div>

      <Widget widgetTitle={boardName}>
        <BoardTableComponent board={board} isLoading={isLoading} />
        <div className="bg-accented p-4">
          <BoardTablePaginatorComponent
            board={board}
            onPageChange={loadNewPage}
            isLoading={isLoading}
            currentPage={Number(pageNo)}
          />
        </div>
      </Widget>

      {!isLoading && (
        <div className="my-3">
          <BBFlex gap="gap-2" className="">
            <BBLink to="/forum">ZFGC.com</BBLink>
            <span>&gt;&gt;</span>
            <span>{boardName}</span>
          </BBFlex>
        </div>
      )}
    </>
  );
};

export default BoardContainer;
