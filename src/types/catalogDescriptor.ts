import type { ReactNode } from "react";
import type { FeaturedItem } from "@/components/cms/showcase/ShowcasePieces";
import type { CatalogParamMap } from "@/hooks/useCatalog";
import type {
  CatalogFilterOption,
  CatalogLanguageOption,
  CatalogSortOption,
} from "@/components/common/BBCatalogToolbar";

export type RailSource = {
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
