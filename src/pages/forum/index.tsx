import type React from "react";
import ForumCategory from "../../components/forum/forumCategory.component";
import { useBBQuery } from "../../hooks/useBBQuery";
import type { Forum } from "../../types/forum";
import Widget from "../../components/common/widgets/widget.component";
import { styled } from "@linaria/react";
import BBLink from "../../components/common/bbLink";

const Style = {
  newsFaderText: styled.div`
    text-align: center;
  `,
};

const ForumMain: React.FC = () => {
  const { data: forumIndex } = useBBQuery<Forum>("/board/forum");

  return (
    <div>
      <Widget className="mb-5">
        <Style.newsFaderText className="m-4">
          Hi! We're read-only for now, but make sure to join us on{" "}
          <BBLink to="https://discord.gg/JvnrcJ7U">Discord!</BBLink>
        </Style.newsFaderText>
      </Widget>

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
