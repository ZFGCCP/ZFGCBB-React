import type {
  Resource,
  ResourceFacets,
  ResourceShowcase,
} from "@/types/content";
import type { CatalogParamMap } from "@/hooks/useCatalog";
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
    previewId: resource.previewContentResourceId,
    title: resource.title,
    author: resource.author,
    status: resource.resourceType,
    rating: resource.rating,
    voteCount: resource.voteCount,
    summary: resource.summaryText,
    contentHtml: resource.page?.contentParsed ?? null,
    href: `/content/resources/${resource.slug}`,
    metaLine:
      resource.downloadCount != null
        ? `${resource.downloadCount.toLocaleString()} downloads`
        : undefined,
  }),
  randomSub: (resource) => resource.resourceType ?? "resource",
  topRatedSub: (resource) =>
    resource.rating != null ? (
      <>
        <Fa6SolidStar aria-hidden className="inline" />{" "}
        {resource.rating.toFixed(1)} · {resource.resourceType ?? "resource"}
      </>
    ) : (
      (resource.resourceType ?? "resource")
    ),
  downloadsSub: (resource) =>
    `${(resource.downloadCount ?? 0).toLocaleString()} downloads · ${resource.resourceType ?? "resource"}`,
  facetOptions: (facets) => ({ filterOptions: facets?.types ?? [] }),
};
