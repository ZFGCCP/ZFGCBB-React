import type React from "react";
import { styled } from "@linaria/react";
import Widget from "../common/widgets/widget.component";
import type { BoardSummary } from "../../types/forum";
import BBLink from "../common/bbLink";
import BBTable from "../common/tables/bbTable.component";

const Style = {
  forumRow: styled.tr`
    min-height: 4rem;
  `,

  forumText: styled.div`
    font-size: 0.8rem;
  `,

  forumDesc: styled.div`
    font-size: .8rem;
  `,
  
  latestPostLink: styled.span`
    font-size: .8rem;
  `

};

const ForumCategory: React.FC<{ title: String; subBoards: BoardSummary[] }> = ({
  title,
  subBoards,
}) => {
  return (
    <Widget widgetTitle={title}>
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
                  <BBLink to={`/forum/board/${sb.boardId}`}>
                    {sb.boardName}
                  </BBLink>
                  <Style.latestPostLink className="d-inline-block d-md-none ms-4">Latest Post</Style.latestPostLink>
                </h6>
                <Style.forumDesc className="d-block d-lg-none">{sb.description}</Style.forumDesc>
                <Style.forumText className="d-block d-lg-none">Child board: hello, hello, hello</Style.forumText>
                <Style.forumText className="d-inline-block d-md-none">Threads: 9001</Style.forumText>
                <Style.forumText className="ms-2 d-inline-block d-md-none">Posts: 9001</Style.forumText>
              </td>

              <td className="d-none d-lg-table-cell col-6 align-content-center">
                <div className="d-flex flex-column">
                  <Style.forumDesc>{sb.description}</Style.forumDesc>
                  <Style.forumText>Child board: hello, hello, hello</Style.forumText>
                </div>
              </td>

              <td className="d-none d-md-table-cell col-2 col-lg-1 align-content-center">
                <div className="d-flex flex-column">
                  <Style.forumText>Threads: 9001</Style.forumText>
                  <Style.forumText>Posts: 9001</Style.forumText>
                </div>
              </td>

              <td className="d-none d-md-table-cell col-4 col-md-2 col-lg-2 align-content-center">
                <div className="d-flex flex-column">
                  <Style.forumText>Last Post by: MG-Zero</Style.forumText>
                  <Style.forumText>in Email Issues</Style.forumText>
                  <Style.forumText>on 07/31/2024 12:00:00PM</Style.forumText>
                </div>
              </td>
            </Style.forumRow>
          );
        })}
        </tbody>
      </BBTable>
    </Widget>
  );
};

export default ForumCategory;
