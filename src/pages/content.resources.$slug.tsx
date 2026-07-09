import { HydrationBoundary } from "@tanstack/react-query";
import type { Route } from "./+types/content.resources.$slug";
import { getQueryClient } from "@/providers/query/queryProvider";

export const loader = ({ request, params }: Route.LoaderArgs) =>
  prefetchQueryDehydrated<Resource>(request, `/resources/${params.slug}`);

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  await getQueryClient().prefetchQuery(
    bbQueryOptions<Resource>(`/resources/${params.slug}`),
  );
}

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
            {resource.publishedTs && (
              <> ({new Date(resource.publishedTs).getFullYear()})</>
            )}
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
  const { data: resource } = useBBQuery<Resource>(`/resources/${slug}`);
  if (!resource) return null;

  const externalUrl =
    resource.downloadUrl && /^https?:\/\//i.test(resource.downloadUrl)
      ? resource.downloadUrl
      : null;

  return (
    <CmsDetailShell
      sectionLabel="Resources"
      basePath="/content/resources"
      title={resource.title}
      entityPath={`/resources/${slug}`}
    >
      <div>
        <Masthead resource={resource} />
        <section className="border-2 border-default bg-accented p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            {resource.downloadContentResourceId ? (
              <>
                <a
                  href={contentUrl(resource.downloadContentResourceId)}
                  className="theme-chest inline-flex items-center gap-2 border-2 border-default bg-elevated px-4 py-2 font-bold text-highlighted hover:bg-muted"
                >
                  <BBIcon name="download" /> Download{" "}
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
                </a>
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
        </section>
      </div>
    </CmsDetailShell>
  );
}

export default function ResourcePage({
  loaderData,
  params,
}: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData?.dehydratedState}>
      <ResourceDetail slug={params.slug!} />
    </HydrationBoundary>
  );
}
