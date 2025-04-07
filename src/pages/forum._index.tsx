import type React from "react";
import ForumCategory from "../components/forum/forumCategory.component";
import { useBBQuery } from "../hooks/useBBQuery";
import type { Forum } from "../types/forum";
import Widget from "../components/common/widgets/widget.component";
import BBLink from "../components/common/bbLink.component";

const ForumMain: React.FC = () => {
  const { data: forumIndex } = useBBQuery<Forum>("/board/forum");

  return (
    <article className="container-xxl">
      <section className="row">
        <Widget className="mb-5 my-2">
          <div className="m-4 text-center animate-fadeInOut">
            Hi! We're read-only for now, but make sure to join us on{" "}
            <BBLink to="https://discord.gg/NP2nNKjun6" target="_blank">
              Discord!
            </BBLink>
          </div>
        </Widget>

        {forumIndex?.categories?.map((cat) => {
          return (
            <div key={`${cat.id}`} className="col-12 my-2">
              <ForumCategory title={cat.categoryName} subBoards={cat.boards} />
            </div>
          );
        })}
      </section>
    </article>
  );
};

export default ForumMain;
