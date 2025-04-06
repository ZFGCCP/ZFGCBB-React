import type React from "react";
import { Suspense, useContext, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { styled } from "styled-components";
import { Button, Pagination } from "react-bootstrap";
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

const Style = {
  forumDesc: styled.div`
    font-size: 0.8rem;
  `,

  boardFooter: styled.div<{ theme: Theme }>`
    background-color: ${(props) => props.theme.footerColor};
  `,

  row: styled.tr<{ theme: Theme }>`
    &.subRow {
      th {
        background-color: ${(props) => props.theme.black};
        color: ${(props) => props.theme.textColor};
        font-size: 0.75rem;
        border: 0;
      }
    }
  `,

  FooterButton: styled(Button)<{ theme: Theme }>`
    &.footer-btn {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      background-color: #25334e;
      border-top: 0;
      border: ${(props) => props.theme.borderWidth} solid
        ${(props) => props.theme.black};
      padding-right: 0.2rem;
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
      border-right: 0;

      &:first-child {
        border-bottom-left-radius: 0.5rem;
      }

      &:last-child {
        border-bottom-right-radius: 0.5rem;
        border-right: 0.2rem solid black;
      }
    }
  `,

  pagination: styled(Pagination)<{ theme: Theme }>`
    &.pagination {
      margin-bottom: 0;

      li.page-item {
        &:hover {
          background-color: ${(props) => props.theme.backgroundColor};
        }

        a {
          border: 0;
        }
      }
    }
  `,

  smallText: styled.div`
    font-size: 0.8rem;
  `,
};

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
    <div className="d-flex justify-content-left">
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
      <Style.row className="tableRow" theme={theme}>
        <th></th>
        <th className="d-none d-sm-table-cell"></th>
        <th>Subject</th>
        <th className="d-none d-md-table-cell">Author</th>
        <th className="d-none d-lg-table-cell">Replies</th>
        <th className="d-none d-lg-table-cell">Views</th>
        <th className="d-none d-md-table-cell d-lg-none"></th>
        <th className="d-none d-md-table-cell">Latest Post</th>
      </Style.row>
      <Style.row className="subRow" theme={theme}>
        <th colSpan={7}></th>
      </Style.row>
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
            <Style.row
              key={`${thread.id}`}
              className="tableRow body"
              theme={theme}
            >
              <td>
                <div>
                  <BBImage
                    src="themes/midnight/images/topic/normal_post.gif"
                    alt="FIXME: add proper alt text"
                  />
                </div>
                <div className="d-block d-sm-none mt-3">
                  <BBImage
                    src="themes/midnight/images/post/xx.gif"
                    alt="FIXME: add proper alt text"
                  />
                </div>
              </td>
              <td className="d-none d-sm-table-cell">
                <BBImage
                  src="themes/midnight/images/post/xx.gif"
                  alt="FIXME: add proper alt text"
                />
              </td>
              <td>
                <BBLink to={`/forum/thread/${thread.id}/1`}>
                  {thread.threadName}
                </BBLink>
                <Style.smallText className="d-block d-md-none">
                  <span>Author: </span>

                  {thread.createdUserId > 0 ? (
                    <BBLink to={`/user/profile/${thread.createdUser?.id}`}>
                      {thread.createdUser?.displayName}
                    </BBLink>
                  ) : (
                    <span>{thread.createdUser?.displayName}</span>
                  )}
                </Style.smallText>
                <Style.smallText className="d-block d-md-none">
                  <span>Replies: {thread.postCount.toString()}</span>
                  <span className="ms-2">
                    Views: {thread.viewCount.toString()}
                  </span>
                </Style.smallText>
                <Style.smallText className="d-block d-md-none">
                  Latest Post by: {thread.latestMessage?.ownerName}
                </Style.smallText>
              </td>
              <td className="d-none d-md-table-cell">
                {thread.createdUserId > 0 ? (
                  <BBLink to={`/user/profile/${thread.createdUser?.id}`}>
                    {thread.createdUser?.displayName}
                  </BBLink>
                ) : (
                  <span>{thread.createdUser?.displayName}</span>
                )}
              </td>
              <td className="d-none d-lg-table-cell">
                {thread.postCount.toString()}
              </td>
              <td className="d-none d-lg-table-cell">
                {thread.viewCount.toString()}
              </td>
              <td className="d-none d-md-table-cell d-lg-none">
                <Style.smallText>
                  Replies: {thread.postCount.toString()}
                </Style.smallText>
                <Style.smallText>
                  Views: {thread.viewCount.toString()}
                </Style.smallText>
              </td>
              <td className="d-none d-md-table-cell">
                <Style.smallText>
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
                </Style.smallText>
                <Style.smallText>
                  on {thread.latestMessage?.lastPostTsAsString}
                </Style.smallText>
              </td>
            </Style.row>
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
        <div className="d-flex gap-2">
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
        <Style.boardFooter theme={currentTheme}>
          <div className="d-sm-none">
            <BoardTablePaginatorComponent
              board={board}
              onPageChange={loadNewPage}
              isLoading={isLoading}
              currentPage={Number(pageNo)}
              maxPageCount={4}
            />
          </div>
          <div className="d-none d-sm-block">
            <BoardTablePaginatorComponent
              board={board}
              onPageChange={loadNewPage}
              isLoading={isLoading}
              currentPage={Number(pageNo)}
            />
          </div>
        </Style.boardFooter>
      </Widget>
    </>
  );
};

export default BoardContainer;
