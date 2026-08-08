import type {
  Resource,
  ResourceFacets,
  ResourceShowcase,
} from "@/types/content";
import type { CatalogParamMap } from "@/hooks/data/useCatalog";
import type { CmsCatalogDescriptor } from "@/types/catalogDescriptor";

const RESOURCE_PARAMS: CatalogParamMap = { filter: "type" };

export const resourceCatalog: CmsCatalogDescriptor<
  Resource,
  ResourceShowcase,
  ResourceFacets
> = {
  heading: "RESOURCES",
  crumb: "Resources",
  api: "/resources",
  basePath: "/content/resources",
  params: RESOURCE_PARAMS,
  itemSchema: ResourceSchema,
  showcaseSchema: ResourceShowcaseSchema,
  facetsSchema: ResourceFacetsSchema,
  searchPlaceholder: "Search resources by title…",
  sortOptions: [
    { value: "", label: "A - Z" },
    { value: "newest", label: "Newest" },
    { value: "rating", label: "Top rated" },
    { value: "views", label: "Most viewed" },
    { value: "downloads", label: "Most downloaded" },
  ],
  kicker: "Top Resource",
  carouselTitle: "Recent Resources",
  viewAllLabel: "View all resources",
  total: (showcase) => showcase.totalResources,
  card: (resource) => <ResourceCardBodyCatalog resource={resource} />,
  featured: (resource) => ({
    previewId: resource.previewContentResourceId ?? undefined,
    title: resource.title,
    author: resource.author ?? undefined,
    status: resource.resourceType ?? undefined,
    rating: resource.rating ?? undefined,
    voteCount: resource.voteCount ?? undefined,
    summary: resource.summaryText ?? undefined,
    contentHtml: resource.page?.contentParsed ?? null,
    href: `/content/resources/${resource.slug}`,
    metaLine:
      resource.downloadCount === null || resource.downloadCount === undefined
        ? undefined
        : `${resource.downloadCount.toLocaleString()} downloads`,
  }),
  randomSub: (resource) => resource.resourceType ?? "resource",
  topRatedSub: (resource) =>
    resource.rating === null || resource.rating === undefined ? (
      (resource.resourceType ?? "resource")
    ) : (
      <>
        <Fa6SolidStar aria-hidden className="inline" />{" "}
        {resource.rating.toFixed(1)} · {resource.resourceType ?? "resource"}
      </>
    ),
  downloadsSub: (resource) =>
    `${(resource.downloadCount ?? 0).toLocaleString()} downloads · ${resource.resourceType ?? "resource"}`,
  facetOptions: (facets) => ({ filterOptions: facets?.types ?? [] }),
};
