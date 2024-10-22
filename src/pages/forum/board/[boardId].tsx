import type React from "react";
import { useContext, useMemo, useState } from "react";
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
import BoardSummary from "../../../components/forum/boards/boardSummary.component";

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
};

const BoardContainer: React.FC = () => {
  const { boardId } = useParams();
  const { currentTheme } = useContext(ThemeContext);
  const [currentPage, setCurrentPage] = useState(1);
  const { data: board } = useBBQuery<Board>(
    `board/${boardId}?pageNo=${currentPage}`,
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
          {board?.childBoards?.length && board?.childBoards?.length > 0 && (
            <Widget widgetTitle={"Child Boards"}>
              <BoardSummary board={board} />
            </Widget>
          )}

          <div className="my-3">ZFGC &gt;&gt; ZFGC.com &gt;&gt; Updates</div>

          {board && (
            <Widget widgetTitle={board.boardName}>
              <BBTable>
                <thead>
                  <Style.row className="tableRow" theme={currentTheme}>
                    <th></th>
                    <th></th>
                    <th>Subject</th>
                    <th>Author</th>
                    <th>Replies</th>
                    <th>Views</th>
                    <th>Latest Post</th>
                  </Style.row>
                  <Style.row className="subRow" theme={currentTheme}>
                    <th colSpan={7}></th>
                  </Style.row>
                </thead>
                <tbody>
                  {board?.unStickyThreads?.map((thread) => {
                    return (
                      <Style.row className="tableRow body" theme={currentTheme}>
                        <td>
                          <img src="http://zfgc.com/forum/Themes/midnight/images/topic/normal_post.gif" />
                        </td>
                        <td>
                          <img src="http://zfgc.com/forum/Themes/midnight/images/post/xx.gif" />
                        </td>
                        <td>
                          <BBLink to={`/forum/thread/${thread.id}`}>
                            {thread.threadName}
                          </BBLink>
                        </td>
                        <td>{thread.createdUser?.displayName}</td>
                        <td>{thread.postCount.toString()}</td>
                        <td>{thread.viewCount.toString()}</td>
                        <td>
                          <div>by {thread.latestMessage?.ownerName}</div>
                          <div>
                            on {thread.latestMessage?.createdTsAsString}
                          </div>
                        </td>
                      </Style.row>
                    );
                  })}
                </tbody>
              </BBTable>
              <Style.boardFooter theme={currentTheme}>
                <BBPaginator
                  numPages={board.pageCount}
                  onPageChange={loadNewPage}
                />
              </Style.boardFooter>
            </Widget>
          )}
        </div>
      </div>
    </>
  );
};

export default BoardContainer;
