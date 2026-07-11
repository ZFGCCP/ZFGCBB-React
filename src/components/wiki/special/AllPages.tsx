export default function AllPages() {
  const { data: config } = useWikiConfig();
  const [searchParams, setSearchParams] = useSearchParams();
  const namespace = searchParams.get("ns") ?? "";
  const filterText = searchParams.get("q") ?? "";
  const pageNo = parsePage(searchParams.get("page"));
  const query = useBBQuery(wikiPagesListUrl(searchParams), {
    schema: pagedSchema(WikiPageRefSchema),
  });
  const [filterDraft, setFilterDraft] = useSyncedDraft(filterText);

  const apply = (next: {
    namespace?: string;
    filterText?: string;
    page?: number;
  }) => {
    setSearchParams(
      (params) =>
        mergeParams(
          params,
          { ns: next.namespace, q: next.filterText, page: next.page ?? 1 },
          { page: "1" },
        ),
      { replace: true },
    );
  };
  const debouncedApplyFilter = useDebouncedCallback(
    (value: string) => apply({ filterText: value }),
    300,
  );

  return (
    <BBWidget widgetTitle="All pages">
      <div className="space-y-3 p-4">
        <form
          role="search"
          onSubmit={(event) => event.preventDefault()}
          className="flex flex-wrap gap-1.5"
        >
          <input
            type="search"
            value={filterDraft}
            placeholder="Filter by title…"
            aria-label="Filter pages by title"
            onChange={(event) => {
              setFilterDraft(event.target.value);
              debouncedApplyFilter(event.target.value);
            }}
            className="grow min-w-48 border-2 border-default bg-muted px-3 py-1.5 text-sm placeholder:text-dimmed focus:bg-elevated focus:outline-none"
          />
          {(config?.namespaces ?? []).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={namespace === option}
              className={`border-2 border-default px-2 py-1 text-xs cursor-pointer ${
                namespace === option
                  ? "bg-accented text-highlighted font-bold"
                  : "bg-muted hover:bg-elevated"
              }`}
              onClick={() =>
                apply({ namespace: namespace === option ? "" : option })
              }
            >
              {option}
            </button>
          ))}
          {query.data && (
            <span
              aria-live="polite"
              className="ml-auto self-center text-xs text-dimmed"
            >
              {query.data.total} pages
            </span>
          )}
        </form>
        <BBQueryBoundary
          query={query}
          isEmpty={(data) => !data.items.length}
          empty={<BBEmpty message="No pages match your filter." />}
        >
          {(data) => {
            const totalPages = Math.max(
              1,
              Math.ceil(data.total / data.pageSize),
            );
            return (
              <>
                <WikiPageList refs={data.items} />
                {totalPages > 1 && (
                  <BBPaginator
                    numPages={totalPages}
                    currentPage={pageNo}
                    onPageChange={(next) => apply({ page: next })}
                  />
                )}
              </>
            );
          }}
        </BBQueryBoundary>
      </div>
    </BBWidget>
  );
}
