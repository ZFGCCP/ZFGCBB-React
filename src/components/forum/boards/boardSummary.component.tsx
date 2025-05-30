import type React from "react";
import { useContext } from "react";
import { styled } from "styled-components";
import type { BoardSummary } from "../../../types/forum";
import BBTable from "../../common/tables/bbTable.component";
import { ThemeContext } from "../../../providers/theme/themeProvider";
import BBLink from "../../common/bbLink.component";
import type { Theme } from "../../../types/theme";
import BBImage from "@/components/common/bbImage.component";

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
  return (
    <BBTable className="table align-middle">
      <tbody>
        {subBoards?.map((sb) => {
          return (
            <tr key={`${sb.boardId}`} className="d-flex min-h-16">
              <td className="col-2 col-md-1 align-content-center">
                <BBImage
                  className="mt-0 mb-0"
                  src="themes/midnight/images/board-summary/off.gif"
                  alt="Off"
                />
              </td>

              <td className="col-10 col-md-7 col-lg-2 align-content-center">
                <h6 className="mb-0">
                  <BBLink to={`/forum/board/${sb.boardId}/1`}>
                    {sb.boardName}
                  </BBLink>
                  <span className="d-inline-block d-md-none ms-4 text-sm">
                    <BBLink to={`/forum/thread/${sb.latestThreadId}/1`}>
                      Latest Post
                    </BBLink>
                  </span>
                </h6>
                <div className="d-block d-lg-none">{sb.description}</div>
                {sb.childBoards && (
                  <div className="d-block d-lg-none text-sm">
                    Child boards:{" "}
                    {sb.childBoards.map((cb) => {
                      return (
                        <BBLink
                          key={`${cb.boardId}`}
                          to={`/forum/board/${cb.boardId}/1`}
                        >
                          {cb.boardName}
                        </BBLink>
                      );
                    })}
                  </div>
                )}
                <div className="d-inline-block d-md-none text-sm">
                  Threads: {sb.threadCount}
                </div>
                <div className="ms-2 d-inline-block d-md-none text-sm">
                  Posts: {sb.postCount}
                </div>
              </td>

              <td className="d-none d-lg-table-cell col-6 align-content-center">
                <div className="d-flex flex-column">
                  <div className="text-sm">{sb.description}</div>
                  {sb.childBoards && (
                    <div className="text-sm">
                      Child boards:{" "}
                      {sb.childBoards.map((cb) => {
                        return (
                          <BBLink
                            key={`${cb.boardId}`}
                            to={`/forum/board/${cb.boardId}/1`}
                          >
                            {cb.boardName}
                          </BBLink>
                        );
                      })}
                    </div>
                  )}
                </div>
              </td>

              <td className="d-none d-md-table-cell col-2 col-lg-1 align-content-center">
                <div className="d-flex flex-column text-sm">
                  <div>Threads: {sb.threadCount}</div>
                  <div>Posts: {sb.postCount}</div>
                </div>
              </td>

              <td className="d-none d-md-table-cell col-4 col-md-2 col-lg-2 align-content-center">
                <div className="d-flex flex-column text-sm">
                  <div>
                    <span>Last Post by: </span>
                    {sb.latestMessageOwnerId && sb.latestMessageOwnerId > 0 ? (
                      <BBLink to={`/user/profile/${sb.latestMessageOwnerId}`}>
                        {sb.latestMessageUserName}
                      </BBLink>
                    ) : (
                      <span>{sb.latestMessageUserName}</span>
                    )}
                  </div>
                  <div>
                    in{" "}
                    <BBLink to={`/forum/thread/${sb.latestThreadId}/1`}>
                      {sb.threadName}
                    </BBLink>
                  </div>
                  <div>on {sb.latestMessageCreatedTsAsString}</div>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </BBTable>
  );
};

export default BoardSummaryView;
