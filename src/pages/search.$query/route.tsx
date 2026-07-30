import type { PrefetchTarget } from "@/shared/http/ssrPrefetch";
import type * as v from "valibot";
import type { Route } from "./+types/route";
import { getQueryClient } from "@/providers/query/queryProvider";

type SearchRealm = v.InferOutput<typeof SearchRealmSchema>;
type SearchResults = v.InferOutput<typeof SearchResultsSchema>;

const searchResultsEmpty = (results: SearchResults) => results.total === 0;

function SearchRealmButton({
  realm,
  active,
  onSelect,
}: {
  realm: SearchRealm;
  active: boolean;
  onSelect: (type: string) => void;
}) {
  const select = useCallback(() => {
    onSelect(realm.type);
  }, [onSelect, realm.type]);

  return (
    <button
      type="button"
      onClick={select}
      className={`border-2 border-default px-3 py-0.5 text-xs tracking-wide ${
        active
          ? "bg-elevated font-bold text-highlighted"
          : "bg-muted text-dimmed hover:bg-elevated hover:text-highlighted"
      }`}
    >
      {realm.label}
    </button>
  );
}

function SearchResultGroups({
  results,
  query,
}: {
  results: SearchResults;
  query: string;
}) {
  return results.groups.flatMap((group) =>
    group.hits.length > 0
      ? [
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
              {group.hits.map((hit) => (
                <li key={`${hit.type}:${hit.url}`}>
                  <Link
                    to={hit.url}
                    className="block px-4 py-2.5 transition-colors hover:bg-elevated"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="truncate text-sm font-bold text-highlighted">
                        <HighlightMatch text={hit.title} query={query} />
                      </span>
                      {hit.context && (
                        <span className="shrink-0 whitespace-nowrap border border-default bg-accented px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-dimmed">
                          {hit.context}
                        </span>
                      )}
                    </div>
                    {hit.snippet && (
                      <p className="mt-1 line-clamp-2 text-xs text-dimmed">
                        <HighlightMatch text={hit.snippet} query={query} />
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>,
        ]
      : [],
  );
}

function searchTargets(
  request: Request,
  query: string | undefined,
): PrefetchTarget[] {
  const targets: PrefetchTarget[] = [
    { url: "/search/realms", schema: SearchRealmListSchema },
  ];
  const decoded = query ?? "";
  if (decoded.trim().length >= 2) {
    const api = new URLSearchParams({ q: decoded });
    const types = new URL(request.url).searchParams.get("types");
    if (types) api.set("types", types);
    targets.push({
      url: `/search?${api.toString()}`,
      schema: SearchResultsSchema,
    });
  }
  return targets;
}

export const loader = ({ request, params }: Route.LoaderArgs) =>
  prefetchQueryDehydrated(request, searchTargets(request, params.query));

export async function clientLoader({
  request,
  params,
}: Route.ClientLoaderArgs) {
  await Promise.all(
    searchTargets(request, params.query).map(({ url, schema }) =>
      getQueryClient().prefetchQuery(bbQueryOptions(url, { schema })),
    ),
  );
}

function SearchResultsView() {
  const { query = "" } = useParams();
  const decoded = query;
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get("types") ?? "";
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const apiQuery = new URLSearchParams({ q: decoded });
  if (filter) apiQuery.set("types", filter);
  const resultsQuery = useBBQuery(`/search?${apiQuery.toString()}`, {
    enabled: decoded.trim().length >= 2,
    schema: SearchResultsSchema,
  });
  const { data: filters = [] } = useSearchRealms();

  const setFilter = useCallback(
    (key: string) => {
      setSearchParams((params) => mergeParams(params, { types: key }), {
        replace: true,
      });
    },
    [setSearchParams],
  );
  const submitSearch = useCallback(
    (event: React.SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      const value = inputRef.current?.value.trim() ?? "";
      if (value.length >= 2) {
        void navigate(`/search/${encodeURIComponent(value)}`);
      }
    },
    [navigate],
  );
  const emptyResults = useMemo(
    () => (
      <p className="px-4 py-16 text-center text-sm text-dimmed">
        No matches for “{decoded}”. Try a broader term or a different realm.
      </p>
    ),
    [decoded],
  );
  const renderResults = useCallback(
    (results: SearchResults) => (
      <SearchResultGroups results={results} query={decoded} />
    ),
    [decoded],
  );

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
          {resultsQuery.data && (
            <span className="ml-auto self-center text-xs tracking-widest text-dimmed">
              {resultsQuery.data.total} MATCH
              {resultsQuery.data.total === 1 ? "" : "ES"}
              {resultsQuery.isFetching ? " …" : ""}
            </span>
          )}
        </div>
      </header>

      <BBPanel>
        <form
          className="flex items-center gap-2 border-b-2 border-default bg-accented px-3 py-2.5"
          onSubmit={submitSearch}
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
              <SearchRealmButton
                key={realm.type || "all"}
                realm={realm}
                active={isActive}
                onSelect={setFilter}
              />
            );
          })}
        </div>

        {decoded.trim().length < 2 ? (
          <p className="px-4 py-16 text-center text-sm text-dimmed">
            Enter a search term to begin.
          </p>
        ) : (
          <BBQueryBoundary
            query={resultsQuery}
            isEmpty={searchResultsEmpty}
            empty={emptyResults}
          >
            {renderResults}
          </BBQueryBoundary>
        )}
      </BBPanel>
    </section>
  );
}

export default function SearchResultsPage() {
  return <SearchResultsView />;
}
