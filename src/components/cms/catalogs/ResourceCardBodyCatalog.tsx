import type { Resource } from "@/types/content";

export default function ResourceCardBodyCatalog({
  resource,
}: {
  resource: Resource;
}) {
  const location = useLocation();
  const year = wireYear(resource.publishedTs);
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
