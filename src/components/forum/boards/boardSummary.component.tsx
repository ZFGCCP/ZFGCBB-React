import React, { useContext } from "react";
import { Board } from "../../../types/forum";
import BBTable from "../../common/tables/bbTable.component";
import { ThemeContext } from "../../../providers/theme/themeProvider";
import BBLink from "../../common/bbLink";
import { Theme } from "../../../types/theme";
import { styled } from "@linaria/react";

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
                <BBLink to={`/forum/board/${board.id}`}>
                  {board.boardName}
                </BBLink>
              </td>
              <td className="col-6">
                <div className="d-flex flex-column">
                  <Style.forumDesc>{board.description}</Style.forumDesc>
                  <Style.forumDesc>Moderators: me, me and me</Style.forumDesc>
                  <Style.forumDesc>
                    Child board: hello, hello, hello
                  </Style.forumDesc>
                </div>
              </td>

              <td className="col-1">
                <div className="align-content-center">
                  <div className="d-flex flex-column">
                    <Style.forumDesc>
                      Threads: {board.threadCount}
                    </Style.forumDesc>
                    <Style.forumDesc>Posts: 9001</Style.forumDesc>
                  </div>
                </div>
              </td>
              <td className="col-2">
                <div className="align-content-center">
                  <div className="d-flex flex-column">
                    <Style.forumDesc>Last Post by: MG-Zero</Style.forumDesc>
                    <Style.forumDesc>in Email Issues</Style.forumDesc>
                    <Style.forumDesc>on 07/31/2024 12:00:00PM</Style.forumDesc>
                  </div>
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
