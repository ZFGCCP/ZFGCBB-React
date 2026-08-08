import type { Route } from "./+types/route";

export const loader = ({ request }: Route.LoaderArgs) =>
  prefetchQueryDehydrated(request, "/wiki/meta/config", WikiConfigSchema);

export default function WikiLayout() {
  return (
    <article>
      <section className="col-12 my-2">
        <Outlet />
      </section>
    </article>
  );
}
