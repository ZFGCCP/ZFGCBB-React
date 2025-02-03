import type React from "react";
import Widget from "../common/widgets/widget.component";
import type { BoardSummary } from "../../types/forum";
import BoardSummaryView from "./boards/boardSummary.component";

const ForumCategory: React.FC<{ title: String; subBoards: BoardSummary[] }> = ({
  title,
  subBoards,
}) => {
  return (
    <Widget widgetTitle={title}>
      <BoardSummaryView subBoards={subBoards} />
    </Widget>
  );
};

export default ForumCategory;
