export interface CatalogFilterOption {
  value: string;
  count?: number;
}

export interface CatalogLanguageOption {
  value: string;
  count: number;
}

export interface CatalogSortOption {
  value: string;
  label: string;
}

export interface CatalogQuery {
  search?: string;
  author?: string;
  filter?: string;
  sort?: string;
  language?: string;
  availability?: string;
}

interface BBCatalogToolbarProps {
  search: string;
  author: string;
  filter: string;
  sort: string;
  availability: string;
  language?: string;
  languageOptions?: CatalogLanguageOption[];
  filterOptions: CatalogFilterOption[];
  sortOptions: readonly CatalogSortOption[];
  total: number | null;
  searchPlaceholder: string;
  onChange: (next: CatalogQuery) => void;
}

export default function BBCatalogToolbar({
  search,
  author,
  filter,
  sort,
  availability,
  language,
  languageOptions,
  filterOptions,
  sortOptions,
  total,
  searchPlaceholder,
  onChange,
}: BBCatalogToolbarProps) {
  const [searchDraft, setSearchDraft] = useSyncedDraft(search);
  const [authorDraft, setAuthorDraft] = useSyncedDraft(author);
  const debouncedSearch = useDebouncedCallback(
    (value: string) => onChange({ search: value }),
    300,
  );
  const debouncedAuthor = useDebouncedCallback(
    (value: string) => onChange({ author: value }),
    300,
  );

  const tokens = filter.split(",").filter(Boolean);
  const stateOf = (value: string): "include" | "exclude" | "off" =>
    tokens.includes(value)
      ? "include"
      : tokens.includes(`-${value}`)
        ? "exclude"
        : "off";
  const cycle = (value: string) => {
    const remainingTokens = tokens.filter(
      (token) => token !== value && token !== `-${value}`,
    );
    const state = stateOf(value);
    const next =
      state === "off"
        ? [...remainingTokens, value]
        : state === "include"
          ? [...remainingTokens, `-${value}`]
          : remainingTokens;
    onChange({ filter: next.join(",") });
  };

  return (
    <form
      role="search"
      onSubmit={(event) => event.preventDefault()}
      className="border-b-2 border-default bg-muted/40 px-4 py-3 space-y-2"
    >
      <div className="flex flex-wrap items-center gap-2">
        <label className="grow min-w-48">
          <span className="sr-only">Search by title</span>
          <input
            type="search"
            value={searchDraft}
            placeholder={searchPlaceholder}
            onChange={(event) => {
              setSearchDraft(event.target.value);
              debouncedSearch(event.target.value);
            }}
            className="w-full border-2 border-default bg-muted px-3 py-1.5 text-sm placeholder:text-dimmed focus:bg-elevated focus:outline-none"
          />
        </label>
        <label className="min-w-36">
          <span className="sr-only">Filter by author</span>
          <input
            type="search"
            value={authorDraft}
            placeholder="Author…"
            onChange={(event) => {
              setAuthorDraft(event.target.value);
              debouncedAuthor(event.target.value);
            }}
            className="w-full border-2 border-default bg-muted px-3 py-1.5 text-sm placeholder:text-dimmed focus:bg-elevated focus:outline-none"
          />
        </label>
        {languageOptions && (
          <label className="flex items-center gap-2 text-xs text-dimmed">
            Language
            <select
              value={language ?? ""}
              onChange={(event) => onChange({ language: event.target.value })}
              className="border-2 border-default bg-muted px-2 py-1.5 text-sm text-default cursor-pointer"
            >
              <option value="">Any</option>
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.value} ({option.count})
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="flex items-center gap-2 text-xs text-dimmed">
          Sort
          <select
            value={sort}
            onChange={(event) => onChange({ sort: event.target.value })}
            className="border-2 border-default bg-muted px-2 py-1.5 text-sm text-default cursor-pointer"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          className="chip"
          aria-pressed={tokens.length === 0}
          onClick={() => onChange({ filter: "" })}
        >
          ALL
        </button>
        {filterOptions.map((option) => {
          const state = stateOf(option.value);
          return (
            <button
              key={option.value}
              type="button"
              className="chip"
              data-state={state}
              aria-label={`${option.value}: ${
                state === "include"
                  ? "included, click to exclude"
                  : state === "exclude"
                    ? "excluded, click to clear"
                    : "click to include"
              }`}
              title={
                state === "include"
                  ? "Included — click to exclude"
                  : state === "exclude"
                    ? "Excluded — click to clear"
                    : "Click to include"
              }
              onClick={() => cycle(option.value)}
            >
              {state === "exclude" && (
                <Fa6SolidXmark aria-hidden className="mr-1 inline" />
              )}
              {option.value}
            </button>
          );
        })}
        <span aria-hidden className="mx-1 h-5 border-l-2 border-default" />
        <button
          type="button"
          className="chip"
          aria-pressed={availability === "yes"}
          onClick={() =>
            onChange({ availability: availability === "yes" ? "" : "yes" })
          }
        >
          HAS FILES
        </button>
        <button
          type="button"
          className="chip"
          aria-pressed={availability === "no"}
          onClick={() =>
            onChange({ availability: availability === "no" ? "" : "no" })
          }
        >
          MISSING FILES
        </button>
        {total != null && (
          <span aria-live="polite" className="ml-auto text-xs text-dimmed">
            {total} {total === 1 ? "entry" : "entries"}
          </span>
        )}
      </div>
    </form>
  );
}
