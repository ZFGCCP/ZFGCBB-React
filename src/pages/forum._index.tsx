import type { Route } from "./+types/forum._index";
import { getQueryClient } from "@/providers/query/queryProvider";

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
          isEmpty={(forum) => !forum.categories?.length}
          empty={<BBEmpty message="No boards here yet. Check back soon!" />}
        >
          {(forumIndex) =>
            forumIndex.categories?.map((category) => (
              <div key={category.id} className="my-2">
                <ForumCategory
                  title={category.categoryName}
                  subBoards={category.boards}
                />
              </div>
            ))
          }
        </BBQueryBoundary>
      </section>
    </article>
  );
}

export default function ForumMain() {
  return <ForumContent />;
}
