import { useCatalog } from "@/hooks/useCatalog";
import type { Showcase } from "@/types/content";
import type {
  CmsCatalogDescriptor,
  RailSource,
} from "@/components/cms/catalogDescriptor";

export function CmsCatalogBrowse<
  TItem extends RailSource,
  TShowcase extends Showcase<TItem>,
  TFacets,
>({
  descriptor,
}: {
  descriptor: CmsCatalogDescriptor<TItem, TShowcase, TFacets>;
}) {
  const { searchParams, data, apply, totalPages } = useCatalog<TItem>(
    descriptor.api,
    descriptor.params,
  );
  const { data: facets } = useBBQuery<TFacets>(`${descriptor.api}/facets`);
  const { filterOptions, languageOptions } = descriptor.facetOptions(facets);
  const label = descriptor.crumb.toLowerCase();

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
      <ul className="grid list-none grid-cols-1 gap-3 p-4 md:grid-cols-3">
        {(data?.items ?? []).map((item) => (
          <li key={item.slug} className="flex">
            {descriptor.card(item)}
          </li>
        ))}
        {data && data.items.length === 0 && (
          <li className="col-span-full py-8 text-center text-sm text-dimmed">
            No {label} match — try clearing the search or filters.
          </li>
        )}
      </ul>
      {totalPages > 1 && (
        <nav
          aria-label={`${descriptor.crumb} catalog pages`}
          className="border-t-2 border-default px-4 py-3"
        >
          <BBPaginator
            numPages={totalPages}
            currentPage={Number(searchParams.get("page") ?? "1")}
            onPageChange={(pageNo) => apply({ page: pageNo })}
          />
        </nav>
      )}
    </div>
  );
}
