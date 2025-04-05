import type React from "react";
import ForumCategory from "../components/forum/forumCategory.component";
import { useBBQuery } from "../hooks/useBBQuery";
import type { Forum } from "../types/forum";
import Widget from "../components/common/widgets/widget.component";
import { styled } from "styled-components";
import BBLink from "../components/common/bbLink.component";

const Style = {
  newsFaderText: styled.div`
    text-align: center;
    /* add a looping text fade in/out animation */
    animation: fadeInOut 7s infinite;
    @keyframes fadeInOut {
      0% {
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  `,
};

const ForumMain: React.FC = () => {
  const { data: forumIndex } = useBBQuery<Forum>("/board/forum");

  return (
    <div>
      <Widget className="mb-5 my-2">
        <Style.newsFaderText className="m-4">
          Hi! We're read-only for now, but make sure to join us on{" "}
          <BBLink to="https://discord.gg/NP2nNKjun6" target="_blank">
            Discord!
          </BBLink>
        </Style.newsFaderText>
      </Widget>

      {forumIndex?.categories?.map((cat) => {
        return (
          <div key={`${cat.id}`} className="col-12 my-2">
            <ForumCategory title={cat.categoryName} subBoards={cat.boards} />
          </div>
        );
      })}
    </div>
  );
};

export default ForumMain;
