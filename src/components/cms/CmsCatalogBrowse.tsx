import type { Showcase } from "@/types/content";
import type {
  CmsCatalogDescriptor,
  RailSource,
} from "@/types/catalogDescriptor";

export default function CmsCatalogBrowse<
  TItem extends RailSource,
  TShowcase extends Showcase<TItem>,
  TFacets,
>({
  descriptor,
}: {
  descriptor: CmsCatalogDescriptor<TItem, TShowcase, TFacets>;
}) {
  const { searchParams, data, query, apply, totalPages } = useCatalog<TItem>(
    descriptor.api,
    descriptor.params,
    descriptor.itemSchema,
  );
  const { data: facets } = useBBQuery(`${descriptor.api}/facets`, {
    schema: descriptor.facetsSchema,
  });
  const { filterOptions, languageOptions } = descriptor.facetOptions(facets);
  const label = descriptor.crumb.toLowerCase();
  const isEmpty = useCallback((page: { items: TItem[] }) => {
    return page.items.length === 0;
  }, []);
  const empty = useMemo(
    () => (
      <BBEmpty
        message={`No ${label} match — try clearing the search or filters.`}
      />
    ),
    [label],
  );
  const renderPage = useCallback(
    (page: { items: TItem[] }) => (
      <ul className="grid list-none grid-cols-1 gap-3 p-4 md:grid-cols-3">
        {page.items.map((item) => (
          <li key={item.slug} className="flex">
            {descriptor.card(item)}
          </li>
        ))}
      </ul>
    ),
    [descriptor],
  );
  const changePage = useCallback((page: number) => apply({ page }), [apply]);

  return (
    <div className="border-2 border-t-0 border-default">
      <BBCatalogToolbar
        search={searchParams.get("q") ?? ""}
        author={searchParams.get("author") ?? ""}
        filter={searchParams.get(descriptor.params.filter) ?? ""}
        sort={searchParams.get("sort") ?? ""}
        availability={searchParams.get("files") ?? ""}
        language={
          descriptor.params.language
            ? (searchParams.get(descriptor.params.language) ?? "")
            : undefined
        }
        languageOptions={languageOptions}
        filterOptions={filterOptions}
        sortOptions={descriptor.sortOptions}
        total={data?.total ?? null}
        searchPlaceholder={descriptor.searchPlaceholder}
        onChange={apply}
      />
      <BBQueryBoundary query={query} isEmpty={isEmpty} empty={empty}>
        {renderPage}
      </BBQueryBoundary>
      {totalPages > 1 && (
        <nav
          aria-label={`${descriptor.crumb} catalog pages`}
          className="border-t-2 border-default px-4 py-3"
        >
          <BBPaginator
            numPages={totalPages}
            currentPage={parsePage(searchParams.get("page"))}
            onPageChange={changePage}
          />
        </nav>
      )}
    </div>
  );
}
