import type React from "react";
import { useContext } from "react";
import { styled } from "@linaria/react";
import type { Board } from "../../../types/forum";
import BBTable from "../../common/tables/bbTable.component";
import { ThemeContext } from "../../../providers/theme/themeProvider";
import BBLink from "../../common/bbLink";
import type { Theme } from "../../../types/theme";

const Style = {
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

  forumDesc: styled.div`
    font-size: 0.8rem;
  `,
};

const BoardSummary: React.FC<{ board: Board }> = ({ board }) => {
  const { currentTheme } = useContext(ThemeContext);

  return (
    <BBTable>
      <tbody>
        {board?.childBoards?.map((board) => {
          return (
            <Style.row className="tableRow body" theme={currentTheme}>
              <td className="col-1">
                <img src="http://zfgc.com/forum/Themes/midnight/images/off.gif" />
              </td>
              <td className="col-2">
                <BBLink to={`/forum/board/${board.boardId}`}>
                  {board.boardName}
                </BBLink>
              </td>
              <td className="col-6">
                <div className="d-flex flex-column">
                  <Style.forumDesc>{board.description}</Style.forumDesc>
                  <Style.forumDesc>Moderators: No one yet :)</Style.forumDesc>
                  {board.childBoards && (
                    <Style.forumDesc>
                      Child boards:{" "}
                      {board.childBoards.map((cb) => (
                        <BBLink to={`/forum/board/${cb.boardId}`}>
                          {cb.boardName},
                        </BBLink>
                      ))}
                    </Style.forumDesc>
                  )}
                </div>
              </td>

              <td className="col-1">
                <div className="align-content-center">
                  <div className="d-flex flex-column">
                    <Style.forumDesc>
                      Threads: {board.threadCount}
                    </Style.forumDesc>
                    <Style.forumDesc>Posts: {board.postCount}</Style.forumDesc>
                  </div>
                </div>
              </td>
              <td className="col-2">
                <div className="align-content-center">
                  {board.latestThreadId && (
                    <div className="d-flex flex-column">
                      <Style.forumDesc>
                        Last Post by: {board.latestMessageUserName}
                      </Style.forumDesc>
                      <Style.forumDesc>in Email Issues</Style.forumDesc>
                      <Style.forumDesc>
                        on 07/31/2024 12:00:00PM
                      </Style.forumDesc>
                    </div>
                  )}
                  {!board.latestThreadId && <span>No recent posts</span>}
                </div>
              </td>
            </Style.row>
          );
        })}
      </tbody>
    </BBTable>
  );
};

export default BoardSummary;
