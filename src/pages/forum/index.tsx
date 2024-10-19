import type React from "react";
import ForumCategory from "../../components/forum/forumCategory.component";
import { useBBQuery } from "../../hooks/useBBQuery";
import type { Forum } from "../../types/forum";

const ForumMain: React.FC = () => {
  const forumIndex = useBBQuery<Forum>("board/forum");

  return (
    <div className="row">
      {forumIndex?.categories?.map((cat) => {
        return (
          <div className="col-12 my-2">
            <ForumCategory title={cat.categoryName} subBoards={cat.boards} />
          </div>
        );
      })}
    </div>
  );
};

export default ForumMain;
