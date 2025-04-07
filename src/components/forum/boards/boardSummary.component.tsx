import type React from "react";
import { useContext } from "react";
import type { BoardSummary } from "../../../types/forum";
import BBTable from "../../common/tables/bbTable.component";
import { ThemeContext } from "../../../providers/theme/themeProvider";
import BBLink from "../../common/bbLink.component";
import type { Theme } from "../../../types/theme";
import BBImage from "@/components/common/bbImage.component";

const BoardSummaryView: React.FC<{ subBoards: BoardSummary[] }> = ({
  subBoards,
}) => {
  const { currentTheme } = useContext(ThemeContext);

  return (
    <BBTable className="align-middle">
      <tbody>
        {subBoards?.map((sb) => {
          return (
            <tr key={`${sb.boardId}`} className="flex min-h-16">
              <td className="w-1/6 md:w-1/12 self-center">
                <BBImage
                  className="my-0"
                  src="themes/midnight/images/board-summary/off.gif"
                  alt="Off"
                />
              </td>

              <td className="w-5/6 md:w-7/12 lg:w-1/6 self-center">
                <h6 className="mb-0">
                  <BBLink to={`/forum/board/${sb.boardId}/1`}>
                    {sb.boardName}
                  </BBLink>
                  <span className="inline-block md:hidden ml-4 text-xs">
                    <BBLink to={`/forum/thread/${sb.latestThreadId}/1`}>
                      Latest Post
                    </BBLink>
                  </span>
                </h6>
                <div className="block lg:hidden text-xs">{sb.description}</div>
                {sb.childBoards && (
                  <div className="block lg:hidden text-xs">
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
                <div className="inline-block md:hidden text-xs">
                  Threads: {sb.threadCount}
                </div>
                <div className="ml-2 inline-block md:hidden text-xs">
                  Posts: {sb.postCount}
                </div>
              </td>

              <td className="hidden lg:table-cell w-1/2 self-center">
                <div className="flex flex-col">
                  <div className="text-xs">{sb.description}</div>
                  {sb.childBoards && (
                    <div className="text-xs">
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

              <td className="hidden md:table-cell w-1/6 lg:w-1/12 self-center">
                <div className="flex flex-col">
                  <div className="text-xs">Threads: {sb.threadCount}</div>
                  <div className="text-xs">Posts: {sb.postCount}</div>
                </div>
              </td>

              <td className="hidden md:table-cell w-1/3 md:w-1/6 lg:w-1/6 self-center">
                <div className="flex flex-col">
                  <div className="text-xs">
                    <span>Last Post by: </span>
                    {sb.latestMessageOwnerId && sb.latestMessageOwnerId > 0 ? (
                      <BBLink to={`/user/profile/${sb.latestMessageOwnerId}`}>
                        {sb.latestMessageUserName}
                      </BBLink>
                    ) : (
                      <span>{sb.latestMessageUserName}</span>
                    )}
                  </div>
                  <div className="text-xs">
                    in{" "}
                    <BBLink to={`/forum/thread/${sb.latestThreadId}/1`}>
                      {sb.threadName}
                    </BBLink>
                  </div>
                  <div className="text-xs">
                    on {sb.latestMessageCreatedTsAsString}
                  </div>
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
