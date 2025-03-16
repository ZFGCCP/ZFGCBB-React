import type React from "react";
import { useContext } from "react";
import { styled } from "@linaria/react";
import type { BoardSummary } from "../../../types/forum";
import BBTable from "../../common/tables/bbTable.component";
import { ThemeContext } from "../../../providers/theme/themeProvider";
import BBLink from "../../common/bbLink";
import type { Theme } from "../../../types/theme";

const Style = {
  forumRow: styled.tr`
    min-height: 4rem;
  `,

  forumText: styled.div`
    font-size: 0.8rem;
  `,

  forumDesc: styled.div`
    font-size: 0.8rem;
  `,

  latestPostLink: styled.span`
    font-size: 0.8rem;
  `,
};

const BoardSummaryView: React.FC<{ subBoards: BoardSummary[] }> = ({
  subBoards,
}) => {
  const { currentTheme } = useContext(ThemeContext);

  return (
    <BBTable>
      <tbody>
        {subBoards?.map((sb) => {
          return (
            <Style.forumRow className="d-flex">
              <td className="col-2 col-md-1">
                <img src="http://zfgc.com/forum/Themes/midnight/images/off.gif" />
              </td>

              <td className="col-10 col-md-7 col-lg-2 align-content-center">
                <h6>
                  <BBLink to={`/forum/board/${sb.boardId}?pageNo=1`}>
                    {sb.boardName}
                  </BBLink>
                  <Style.latestPostLink className="d-inline-block d-md-none ms-4">
                    Latest Post
                  </Style.latestPostLink>
                </h6>
                <Style.forumDesc className="d-block d-lg-none">
                  {sb.description}
                </Style.forumDesc>
                {sb.childBoards && (
                  <Style.forumText className="d-block d-lg-none">
                    Child boards:{" "}
                    {sb.childBoards.map((cb) => {
                      return (
                        <BBLink to={`/forum/board/${cb.boardId}`}>
                          {cb.boardName}
                        </BBLink>
                      );
                    })}
                  </Style.forumText>
                )}
                <Style.forumText className="d-inline-block d-md-none">
                  Threads: {sb.threadCount}
                </Style.forumText>
                <Style.forumText className="ms-2 d-inline-block d-md-none">
                  Posts: {sb.postCount}
                </Style.forumText>
              </td>

              <td className="d-none d-lg-table-cell col-6 align-content-center">
                <div className="d-flex flex-column">
                  <Style.forumDesc>{sb.description}</Style.forumDesc>
                  {sb.childBoards && (
                    <Style.forumText>
                      Child boards:{" "}
                      {sb.childBoards.map((cb) => {
                        return (
                          <BBLink to={`/forum/board/${cb.boardId}`}>
                            {cb.boardName}
                          </BBLink>
                        );
                      })}
                    </Style.forumText>
                  )}
                </div>
              </td>

              <td className="d-none d-md-table-cell col-2 col-lg-1 align-content-center">
                <div className="d-flex flex-column">
                  <Style.forumText>Threads: {sb.threadCount}</Style.forumText>
                  <Style.forumText>Posts: {sb.postCount}</Style.forumText>
                </div>
              </td>

              <td className="d-none d-md-table-cell col-4 col-md-2 col-lg-2 align-content-center">
                <div className="d-flex flex-column">
                  <Style.forumText>
                    Last Post by: {sb.latestMessageUserName}
                  </Style.forumText>
                  <Style.forumText>
                    in <span>{sb.threadName}</span>
                  </Style.forumText>
                  <Style.forumText>
                    on {sb.latestMessageCreatedTsAsString}
                  </Style.forumText>
                </div>
              </td>
            </Style.forumRow>
          );
        })}
      </tbody>
    </BBTable>
  );
};

export default BoardSummaryView;
