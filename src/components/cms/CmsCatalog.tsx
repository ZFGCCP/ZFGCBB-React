import type { ReactNode } from "react";
import type { Showcase } from "@/types/content";
import type { FeaturedItem } from "@/components/cms/showcase/ShowcasePieces";
import { useCatalog, type CatalogParamMap } from "@/hooks/useCatalog";
import type {
  CatalogFilterOption,
  CatalogLanguageOption,
  CatalogSortOption,
} from "@/components/common/BBCatalogToolbar";

type RailSource = {
  previewContentResourceId: number | null;
  title: string;
  slug: string;
};

export type CmsCatalogDescriptor<
  TItem extends RailSource,
  TShowcase,
  TFacets,
> = {
  heading: string;
  crumb: string;
  api: `/${string}`;
  basePath: `/${string}`;
  params: CatalogParamMap;
  searchPlaceholder: string;
  sortOptions: readonly CatalogSortOption[];
  kicker: string;
  carouselTitle: string;
  viewAllLabel: string;
  total: (showcase: TShowcase) => number;
  card: (item: TItem) => ReactNode;
  featured: (item: TItem) => FeaturedItem;
  randomSub: (item: TItem) => ReactNode;
  topRatedSub: (item: TItem) => ReactNode;
  downloadsSub: (item: TItem) => ReactNode;
  facetOptions: (facets: TFacets | undefined) => {
    filterOptions: CatalogFilterOption[];
    languageOptions?: CatalogLanguageOption[];
  };
};

export function CmsCatalog<
  TItem extends RailSource,
  TShowcase extends Showcase<TItem>,
  TFacets,
>({
  descriptor,
}: {
  descriptor: CmsCatalogDescriptor<TItem, TShowcase, TFacets>;
}) {
  const { searchParams, browsing, data, apply, totalPages } = useCatalog<TItem>(
    descriptor.api,
    descriptor.params,
  );
  const { data: showcase } = useBBQuery<TShowcase>(
    `${descriptor.api}/showcase`,
  );
  const { data: facets } = useBBQuery<TFacets>(`${descriptor.api}/facets`, {
    enabled: browsing,
  });
  const { filterOptions, languageOptions } = descriptor.facetOptions(facets);
  const headingId = `${descriptor.crumb.toLowerCase()}-heading`;
  const label = descriptor.crumb.toLowerCase();
  const crumbs = [{ label: "Home", to: "/" }, { label: descriptor.crumb }];

  return (
    <section aria-labelledby={headingId}>
      <BBBreadcrumb crumbs={crumbs} />
      <header className="border-2 border-b-0 border-default bg-accented">
        <div className="flex items-baseline gap-3 px-4 pb-2 pt-3">
          <span aria-hidden className="h-8 w-2 self-center bg-hatch" />
          <h1
            id={headingId}
            className="text-2xl font-bold tracking-[0.2em] text-highlighted"
          >
            {descriptor.heading}
          </h1>
          {showcase && (
            <span className="ml-auto self-center text-xs text-dimmed">
              {descriptor.total(showcase).toLocaleString()} {label}
            </span>
          )}
        </div>
      </header>

      {!browsing && showcase && (
        <CmsShowcase
          kicker={descriptor.kicker}
          featured={
            showcase.featured ? descriptor.featured(showcase.featured) : null
          }
          carousel={{
            title: descriptor.carouselTitle,
            viewAllHref: `${descriptor.basePath}?browse=1`,
            viewAllLabel: descriptor.viewAllLabel,
            slides: showcase.recent.map((item) => ({
              key: item.slug,
              content: descriptor.card(item),
            })),
          }}
          random={toRailItems(
            showcase.random,
            descriptor.basePath,
            descriptor.randomSub,
          )}
          topRated={toRailItems(
            showcase.topRated,
            descriptor.basePath,
            descriptor.topRatedSub,
          )}
          mostDownloaded={toRailItems(
            showcase.mostDownloaded,
            descriptor.basePath,
            descriptor.downloadsSub,
          )}
        />
      )}

      {browsing && (
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
      )}
      <BBBreadcrumb crumbs={crumbs} />
    </section>
  );
}
