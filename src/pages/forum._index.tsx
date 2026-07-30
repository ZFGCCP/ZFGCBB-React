import type { Route } from "./+types/forum._index";
import type { Forum } from "@/types/forum";
import { getQueryClient } from "@/providers/query/queryProvider";

const FORUM_EMPTY_STATE = (
  <BBEmpty message="No boards here yet. Check back soon!" />
);
const isForumEmpty = (forum: Forum) => !forum.categories?.length;
const renderForumCategories = (forumIndex: Forum) =>
  forumIndex.categories?.map((category) => (
    <div key={category.id} className="my-2">
      <ForumCategory
        title={category.categoryName}
        subBoards={category.boards}
      />
    </div>
  ));

export const loader = ({ request }: Route.LoaderArgs) =>
  prefetchQueryDehydrated(request, "/board/forum", ForumSchema);

export async function clientLoader(_: Route.ClientLoaderArgs) {
  await getQueryClient().prefetchQuery(
    bbQueryOptions("/board/forum", { schema: ForumSchema }),
  );
}

export const handle = { breadcrumb: "Forum" };

export function HydrateFallback() {
  return <>Loading...</>;
}

function ForumContent() {
  const query = useForumIndex();
  return (
    <article>
      <section className="grid grid-cols-1 gap-4">
        <BBWidget className="mb-5 my-2">
          <div className="m-4 text-center animate-pulse">
            <div>
              Hi! We're read-only for now, but make sure to join us on{" "}
              <BBLink
                to="https://discord.gg/NP2nNKjun6"
                target="_blank"
                className="text-highlighted"
              >
                Discord!
              </BBLink>
            </div>
          </div>
        </BBWidget>

        <BBQueryBoundary
          query={query}
          isEmpty={isForumEmpty}
          empty={FORUM_EMPTY_STATE}
        >
          {renderForumCategories}
        </BBQueryBoundary>
      </section>
    </article>
  );
}

export default function ForumMain() {
  return <ForumContent />;
}
