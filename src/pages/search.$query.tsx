import { HydrationBoundary } from "@tanstack/react-query";
import { useRef } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { useBBQuery } from "@/hooks/useBBQuery";
import type { SearchRealm, SearchResults } from "@/types/search";
import type { Route } from "./+types/search.$query";
import { getQueryClient } from "@/providers/query/queryProvider";
import { prefetchQueryDehydrated } from "@/shared/http/ssrPrefetch";

export const loader = ({ request }: Route.LoaderArgs) =>
  prefetchQueryDehydrated<SearchRealm[]>(request, "/search/realms");

export async function clientLoader() {
  await getQueryClient().prefetchQuery(
    bbQueryOptions<SearchRealm[]>("/search/realms"),
  );
}

function SearchResultsView() {
  const { query = "" } = useParams();
  const decoded = decodeURIComponent(query);
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get("types") ?? "";
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const apiQuery = new URLSearchParams({ q: decoded });
  if (filter) apiQuery.set("types", filter);
  const { data, isFetching } = useBBQuery<SearchResults>(
    `/search?${apiQuery.toString()}`,
    {
      enabled: decoded.trim().length >= 2,
      queryKey: `search-page:${filter}:${decoded}`,
    },
  );
  const { data: filters = [] } = useSearchRealms();
  const orderedGroups = (data?.groups ?? []).filter(
    (group) => group.hits.length > 0,
  );

  const setFilter = (key: string) => {
    setSearchParams(
      (params) => {
        const merged = new URLSearchParams(params);
        if (key) merged.set("types", key);
        else merged.delete("types");
        return merged;
      },
      { replace: true },
    );
  };

  return (
    <section aria-labelledby="search-heading" className="mx-auto max-w-4xl">
      <header className="border-2 border-b-0 border-default bg-accented">
        <div className="flex items-baseline gap-3 px-4 pb-2 pt-3">
          <span aria-hidden className="h-8 w-2 self-center bg-hatch" />
          <h1
            id="search-heading"
            className="text-2xl font-bold tracking-[0.2em] text-highlighted"
          >
            SEARCH
          </h1>
          <p className="text-sm text-dimmed">
            threads, wiki articles, projects &amp; resources
          </p>
          {data && (
            <span className="ml-auto self-center text-xs tracking-widest text-dimmed">
              {data.total} MATCH{data.total === 1 ? "" : "ES"}
              {isFetching ? " …" : ""}
            </span>
          )}
        </div>
      </header>

      <BBPanel>
        <form
          className="flex items-center gap-2 border-b-2 border-default bg-accented px-3 py-2.5"
          onSubmit={(e) => {
            e.preventDefault();
            const value = inputRef.current?.value.trim() ?? "";
            if (value.length >= 2)
              navigate(`/search/${encodeURIComponent(value)}`);
          }}
        >
          <BBIcon name="search" />
          <input
            key={decoded}
            ref={inputRef}
            defaultValue={decoded}
            placeholder="Search threads, articles, projects, resources…"
            className="min-w-0 grow border-2 border-default bg-default px-3 py-1.5 text-sm text-highlighted placeholder:text-dimmed focus:bg-elevated focus:outline-none"
            aria-label="Search query"
            autoComplete="off"
          />
          <button
            type="submit"
            className="shrink-0 border-2 border-default bg-muted px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-highlighted hover:bg-elevated"
          >
            Go
          </button>
        </form>

        <div className="flex flex-wrap gap-1.5 border-b-2 border-default bg-accented px-3 py-2">
          {filters.map((realm) => {
            const isActive = filter === realm.type;
            return (
              <button
                key={realm.type || "all"}
                type="button"
                onClick={() => setFilter(realm.type)}
                className={`border-2 border-default px-3 py-0.5 text-xs tracking-wide ${
                  isActive
                    ? "bg-elevated font-bold text-highlighted"
                    : "bg-muted text-dimmed hover:bg-elevated hover:text-highlighted"
                }`}
              >
                {realm.label}
              </button>
            );
          })}
        </div>

        {decoded.trim().length < 2 && (
          <p className="px-4 py-16 text-center text-sm text-dimmed">
            Enter a search term to begin.
          </p>
        )}

        {data && data.total === 0 && !isFetching && (
          <p className="px-4 py-16 text-center text-sm text-dimmed">
            No matches for “{decoded}”. Try a broader term or a different realm.
          </p>
        )}

        {orderedGroups.map((group) => (
          <section key={group.type} aria-label={group.label}>
            <header className="flex items-center gap-2 border-b-2 border-default bg-accented px-3 py-1.5">
              <span aria-hidden className="h-3.5 w-1.5 bg-hatch" />
              <BBSectionLabel as="h2" size="2xs">
                {group.label}
              </BBSectionLabel>
              <span className="text-[11px] tracking-widest text-dimmed">
                ({group.total})
              </span>
            </header>
            <ul className="divide-y-2 divide-default/50">
              {group.hits.map((hit, index) => (
                <li key={hit.url + index}>
                  <Link
                    to={hit.url}
                    className="block px-4 py-2.5 transition-colors hover:bg-elevated"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="truncate text-sm font-bold text-highlighted">
                        <HighlightMatch text={hit.title} query={decoded} />
                      </span>
                      {hit.context && (
                        <span className="shrink-0 whitespace-nowrap border border-default bg-accented px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-dimmed">
                          {hit.context}
                        </span>
                      )}
                    </div>
                    {hit.snippet && (
                      <p className="mt-1 line-clamp-2 text-xs text-dimmed">
                        <HighlightMatch text={hit.snippet} query={decoded} />
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </BBPanel>
    </section>
  );
}

export default function SearchResultsPage({
  loaderData,
}: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData?.dehydratedState}>
      <SearchResultsView />
    </HydrationBoundary>
  );
}
