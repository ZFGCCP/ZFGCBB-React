import { useLocation } from "react-router";
import type {
  Resource,
  ResourceFacets,
  ResourceShowcase,
} from "@/types/content";
import type { CatalogParamMap } from "@/hooks/useCatalog";
import type { CmsCatalogDescriptor } from "@/components/cms/catalogDescriptor";

const RESOURCE_PARAMS: CatalogParamMap = { filter: "type" };

function ResourceCardBody({ resource }: { resource: Resource }) {
  const location = useLocation();
  const year = resource.publishedTs
    ? new Date(resource.publishedTs).getFullYear()
    : null;
  const hasFile =
    resource.downloadContentResourceId != null || resource.downloadUrl != null;
  return (
    <BBLink
      to={`/content/resources/${resource.slug}`}
      state={{ from: `${location.pathname}${location.search}` }}
      aria-label={`${resource.title}, ${resource.resourceType}, by ${resource.author ?? "unknown author"}${hasFile ? "" : ", file lost"}`}
      className="group flex w-full flex-col border-2 border-default bg-muted transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <div className="relative h-32 overflow-hidden border-b-2 border-default">
        <Thumb
          previewId={resource.previewContentResourceId}
          title={resource.title}
          className="h-full w-full transition duration-200 motion-safe:group-hover:scale-105"
          letterClassName="text-4xl"
        />
        <span className="absolute right-1.5 top-1.5 border-2 border-default bg-accented/90 px-1.5 py-0.5 text-[10px] font-bold tracking-widest text-highlighted">
          {resource.resourceType}
        </span>
      </div>
      <div className="flex grow flex-col gap-1 p-2.5">
        <p className="font-bold leading-tight">{resource.title}</p>
        <p className="text-xs text-dimmed">
          by{" "}
          <span className="text-default">{resource.author ?? "unknown"}</span>
          {year && ` · ${year}`}
        </p>
        <p className="mt-auto pt-1 text-[11px] text-dimmed">
          {hasFile ? (
            <span className="inline-flex items-center gap-1.5 align-middle text-highlighted">
              <BBIcon name="download" />
              {resource.fileSize != null && resource.fileSize > 0
                ? formatFileSize(resource.fileSize)
                : "download"}
            </span>
          ) : (
            <span>file lost</span>
          )}
          {" · "}
          {resource.rating != null && (resource.voteCount ?? 0) > 0 && (
            <span
              aria-label={`Rated ${resource.rating.toFixed(1)} out of 5 from ${resource.voteCount} votes`}
            >
              <Fa6SolidStar aria-hidden className="inline" />{" "}
              {resource.rating.toFixed(1)} ·{" "}
            </span>
          )}
          {(resource.downloadCount ?? 0).toLocaleString()} downloads
        </p>
      </div>
    </BBLink>
  );
}

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
  card: (resource) => <ResourceCardBody resource={resource} />,
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
