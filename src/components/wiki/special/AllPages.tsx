import type { WikiPageRef } from "@/types/content";

interface PageFilters {
  namespace?: string;
  filterText?: string;
  page?: number;
}

interface WikiPageResult {
  items: WikiPageRef[];
  total: number;
  page: number;
  pageSize: number;
}

const ALL_PAGES_EMPTY_STATE = <BBEmpty message="No pages match your filter." />;
const isPageResultEmpty = (data: WikiPageResult) => data.items.length === 0;

function NamespaceButton({
  option,
  namespace,
  onApply,
}: {
  option: string;
  namespace: string;
  onApply: (next: PageFilters) => void;
}) {
  const handleClick = useCallback(() => {
    onApply({ namespace: namespace === option ? "" : option });
  }, [namespace, onApply, option]);

  return (
    <button
      type="button"
      aria-pressed={namespace === option}
      className={`border-2 border-default px-2 py-1 text-xs cursor-pointer ${
        namespace === option
          ? "bg-accented text-highlighted font-bold"
          : "bg-muted hover:bg-elevated"
      }`}
      onClick={handleClick}
    >
      {option}
    </button>
  );
}

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

  const apply = useCallback(
    (next: PageFilters) => {
      setSearchParams(
        (params) =>
          mergeParams(
            params,
            { ns: next.namespace, q: next.filterText, page: next.page ?? 1 },
            { page: "1" },
          ),
        { replace: true },
      );
    },
    [setSearchParams],
  );
  const debouncedApplyFilter = useDebouncedCallback((value: string) => {
    apply({ filterText: value });
  }, 300);
  const handleSubmit = useCallback(
    (event: React.SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
    },
    [],
  );
  const handleFilterChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilterDraft(event.target.value);
      debouncedApplyFilter(event.target.value);
    },
    [debouncedApplyFilter, setFilterDraft],
  );
  const handlePageChange = useCallback(
    (next: number) => {
      apply({ page: next });
    },
    [apply],
  );
  const renderPageResults = useCallback(
    (data: WikiPageResult) => {
      const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));
      return (
        <>
          <WikiPageList refs={data.items} />
          {totalPages > 1 && (
            <BBPaginator
              numPages={totalPages}
              currentPage={pageNo}
              onPageChange={handlePageChange}
            />
          )}
        </>
      );
    },
    [handlePageChange, pageNo],
  );

  return (
    <BBWidget widgetTitle="All pages">
      <div className="space-y-3 p-4">
        <search>
          <form onSubmit={handleSubmit} className="flex flex-wrap gap-1.5">
            <input
              type="search"
              value={filterDraft}
              placeholder="Filter by title…"
              aria-label="Filter pages by title"
              onChange={handleFilterChange}
              className="grow min-w-48 border-2 border-default bg-muted px-3 py-1.5 text-sm placeholder:text-dimmed focus:bg-elevated focus:outline-none"
            />
            {(config?.namespaces ?? []).map((option) => (
              <NamespaceButton
                key={option}
                option={option}
                namespace={namespace}
                onApply={apply}
              />
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
        </search>
        <BBQueryBoundary
          query={query}
          isEmpty={isPageResultEmpty}
          empty={ALL_PAGES_EMPTY_STATE}
        >
          {renderPageResults}
        </BBQueryBoundary>
      </div>
    </BBWidget>
  );
}
