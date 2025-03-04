import type React from "react";
import { Suspense, useContext, useMemo, useState } from "react";
import { useParams } from "react-router";
import { styled } from "@linaria/react";
import { Button } from "react-bootstrap";

import Widget from "../../../components/common/widgets/widget.component";
import { useBBQuery } from "../../../hooks/useBBQuery";
import type { Board } from "../../../types/forum";
import type { Theme } from "../../../types/theme";
import { ThemeContext } from "../../../providers/theme/themeProvider";
import BBLink from "../../../components/common/bbLink";
import { Pagination } from "react-bootstrap";
import BBPaginator from "../../../components/common/paginator/bbPaginator.component";
import BBTable from "../../../components/common/tables/bbTable.component";
import BoardSummaryView from "../../../components/forum/boards/boardSummary.component";

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

const BoardContainer: React.FC = () => {
  const { boardId } = useParams();
  const { currentTheme } = useContext(ThemeContext);
  const [currentPage, setCurrentPage] = useState(1);
  const { data: board } = useBBQuery<Board>(
    `board/${boardId}?pageNo=${currentPage}`,
    0,
    0,
  );

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

  const loadNewPage = (pageNo: number) => {
    setCurrentPage(pageNo);
  };

  return (
    <>
      <div className="row">
        <div className="col-12 my-2">
          {board && board.childBoards && board?.childBoards?.length > 0 && (
            <Widget widgetTitle={"Child Boards"}>
              <BoardSummaryView subBoards={board.childBoards} />
            </Widget>
          )}

          <div className="my-3">ZFGC &gt;&gt; ZFGC.com &gt;&gt; Updates</div>
          
          <Widget widgetTitle={board?.boardName}>
            <BBTable>
              <thead>
                <Style.row className="tableRow" theme={currentTheme}>
                  <th></th>
                  <th className="d-none d-sm-table-cell"></th>
                  <th>Subject</th>
                  <th className="d-none d-md-table-cell">Author</th>
                  <th className="d-none d-lg-table-cell">Replies</th>
                  <th className="d-none d-lg-table-cell">Views</th>
                  <th className="d-none d-md-table-cell d-lg-none"></th>
                  <th className="d-none d-md-table-cell">Latest Post</th>
                </Style.row>
                <Style.row className="subRow" theme={currentTheme}>
                  <th colSpan={7}></th>
                </Style.row>
              </thead>
              <tbody>
                <Suspense>
                  {board?.unStickyThreads?.map((thread) => {
                    return (
                      <Style.row className="tableRow body" theme={currentTheme}>
                        <td>
                          <div>
                            <img src="http://zfgc.com/forum/Themes/midnight/images/topic/normal_post.gif" />
                          </div>
                          <div className="d-block d-sm-none mt-3">
                            <img src="http://zfgc.com/forum/Themes/midnight/images/post/xx.gif" />
                          </div>
                        </td>
                        <td className="d-none d-sm-table-cell">
                          <img src="http://zfgc.com/forum/Themes/midnight/images/post/xx.gif" />
                        </td>
                        <td>
                          <BBLink to={`/forum/thread/${thread.id}`}>
                            {thread.threadName}
                          </BBLink>
                          <Style.smallText className="d-block d-md-none">
                            Author: {thread.createdUser?.displayName}
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
                          {thread.createdUser?.displayName}
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
                            by {thread.latestMessage?.ownerName}
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
            </BBTable>
            <Style.boardFooter theme={currentTheme}>
              {board && (
                <BBPaginator
                  numPages={board.pageCount}
                  currentPage={currentPage}
                  onPageChange={loadNewPage}
                />
              )}
            </Style.boardFooter>
          </Widget>
        </div>
      </div>
    </>
  );
};

export default BoardContainer;
