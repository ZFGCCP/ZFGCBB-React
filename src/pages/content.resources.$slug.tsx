import type { Route } from "./+types/content.resources.$slug";
import {
  type BreadcrumbHandle,
  type Crumb,
} from "@/components/common/BBBreadcrumb";
import { entityRoute } from "@/shared/http/entityLoaders";

const route = entityRoute({
  url: (params: Route.LoaderArgs["params"]) => `/resources/${params.slug}`,
  schema: ResourceSchema,
  prefetch: (resource, queryClient, headers) =>
    queryClient.prefetchQuery(
      reactionBatchQueryOptions("RESOURCE", [resource.id], headers),
    ),
});

export const loader = route.loader;
export const clientLoader = route.clientLoader;

export const handle = {
  breadcrumb: (match) => {
    const resource = match.loaderData?.entity;
    if (!resource) return "Resources";
    const crumbs: Crumb[] = [
      { label: "Resources", to: "/content/resources" },
      { label: resource.title },
    ];
    return crumbs;
  },
} satisfies BreadcrumbHandle<Awaited<ReturnType<typeof loader>>>;

function Masthead({ resource }: { resource: Resource }) {
  return (
    <CmsMasthead
      steveId={resource.previewContentResourceId}
      title={resource.title}
      stevePadClassName="pt-24 md:pt-36"
    >
      <BBPanel
        as="span"
        className="px-2 py-0.5 text-xs font-bold tracking-widest"
      >
        {resource.resourceType}
      </BBPanel>
      {resource.rating != null && (resource.voteCount ?? 0) > 0 && (
        <RatingBadge rating={resource.rating} voteCount={resource.voteCount!} />
      )}
      <span className="text-dimmed">
        {resource.author && (
          <>
            by{" "}
            <UserLink
              userId={resource.createdUserId}
              name={resource.author}
              className="text-highlighted underline decoration-dotted"
              fallbackClassName="text-default"
            />
            {resource.publishedTs && <> ({wireYear(resource.publishedTs)})</>}
            {" · "}
          </>
        )}
        {resource.viewCount != null && (
          <>{resource.viewCount.toLocaleString()} views</>
        )}
        {resource.downloadCount != null && (
          <> · {resource.downloadCount.toLocaleString()} downloads</>
        )}
      </span>
    </CmsMasthead>
  );
}

function ResourceDetail({ slug }: { slug: string }) {
  const query = useBBQuery(`/resources/${slug}`, {
    schema: ResourceSchema,
  });

  const renderResource = useCallback(
    (resource: Resource) => <ResourceView resource={resource} slug={slug} />,
    [slug],
  );

  return <BBQueryBoundary query={query}>{renderResource}</BBQueryBoundary>;
}

function ResourceView({
  resource,
  slug,
}: {
  resource: Resource;
  slug: string;
}) {
  const externalUrl =
    resource.downloadUrl && /^https?:\/\//i.test(resource.downloadUrl)
      ? resource.downloadUrl
      : null;
  const reactableIds = useMemo(() => [resource.id], [resource.id]);

  return (
    <CmsDetailShell entityPath={`/resources/${slug}`}>
      <div>
        <Masthead resource={resource} />
        <section className="border-2 border-default bg-accented p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            {resource.downloadContentResourceId ? (
              <>
                <BBDownloadLink
                  contentResourceId={resource.downloadContentResourceId}
                  filename={resource.downloadFilename}
                  className="inline-flex items-center gap-2 border-2 border-default bg-elevated px-4 py-2 font-bold text-highlighted hover:bg-muted"
                >
                  Download{" "}
                  {resource.downloadFilename && (
                    <span className="font-normal">
                      {resource.downloadFilename}
                    </span>
                  )}
                  {resource.fileSize != null && resource.fileSize > 0 && (
                    <span className="text-xs font-normal text-dimmed">
                      ({formatFileSize(resource.fileSize)})
                    </span>
                  )}
                </BBDownloadLink>
                {resource.downloadFilename?.toLowerCase().endsWith(".zip") && (
                  <BBArchiveContents
                    contentResourceId={resource.downloadContentResourceId}
                    filename={resource.downloadFilename}
                  />
                )}
              </>
            ) : externalUrl ? (
              <a
                href={externalUrl}
                className="theme-chest inline-flex items-center gap-2 border-2 border-default bg-elevated px-4 py-2 font-bold text-highlighted hover:bg-muted"
                target="_blank"
                rel="noreferrer"
              >
                <BBIcon name="download" /> Download (external)
              </a>
            ) : (
              <BBPanel as="p" className="px-3 py-2 text-sm text-dimmed">
                The original file for this resource was lost during ZFGC's
                history and could not be migrated.
              </BBPanel>
            )}
          </div>
          {resource.page?.contentParsed && (
            <BBHtml
              html={resource.page.contentParsed}
              className="whitespace-pre-wrap border-t-2 border-default pt-3 text-sm"
            />
          )}
          <ReactionsProvider
            reactableType="RESOURCE"
            reactableIds={reactableIds}
          >
            <ReactionBar
              reactableId={resource.id}
              className="border-t-2 border-default pt-3"
            />
          </ReactionsProvider>
        </section>
      </div>
    </CmsDetailShell>
  );
}

export default function ResourcePage({ params }: Route.ComponentProps) {
  return <ResourceDetail slug={params.slug} />;
}
