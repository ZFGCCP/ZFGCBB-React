import type { BoardSummary } from "../../types/forum";

export default function ForumCategory({
  title,
  subBoards,
}: {
  title: string;
  subBoards: BoardSummary[];
}) {
  return (
    <BBWidget widgetTitle={title}>
      <BoardSummaryView subBoards={subBoards} />
    </BBWidget>
  );
}
