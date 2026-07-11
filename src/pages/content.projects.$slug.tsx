import type { Route } from "./+types/content.projects.$slug";
import {
  type BreadcrumbHandle,
  type Crumb,
} from "@/components/common/BBBreadcrumb";
import { entityRoute } from "@/shared/http/entityLoaders";

const route = entityRoute({
  url: (params: Route.LoaderArgs["params"]) => `/projects/${params.slug}`,
  schema: ProjectSchema,
  prefetch: (project, headers) => [
    reactionBatchQueryOptions("PROJECT", [project.id], headers),
  ],
});

export const loader = route.loader;
export const clientLoader = route.clientLoader;

export const handle = {
  breadcrumb: (match) => {
    const project = match.loaderData?.entity;
    if (!project) return "Projects";
    const crumbs: Crumb[] = [
      { label: "Projects", to: "/content/projects" },
      { label: project.title },
    ];
    return crumbs;
  },
} satisfies BreadcrumbHandle<Awaited<ReturnType<typeof loader>>>;

type ProjectTab = "overview" | "screenshots" | "downloads";

function Masthead({ project }: { project: Project }) {
  const steveId =
    project.screenshots.find((screenshot) => screenshot.contentResourceId)
      ?.contentResourceId ?? project.previewContentResourceId;

  return (
    <CmsMasthead steveId={steveId} title={project.title}>
      <BBPanel
        as="span"
        className="px-2 py-0.5 text-xs font-bold tracking-widest"
      >
        {project.status}
      </BBPanel>
      {project.progress > 0 && (
        <span className="flex items-center gap-2">
          <BBPanel as="span" className="h-3 w-36">
            <span
              className="block h-full bg-progress-hatch"
              style={{ width: `${Math.min(100, project.progress)}%` }}
            />
          </BBPanel>
          <span className="text-xs text-dimmed">{project.progress}%</span>
        </span>
      )}
      {project.rating != null && (project.voteCount ?? 0) > 0 && (
        <RatingBadge rating={project.rating} voteCount={project.voteCount!} />
      )}
      <span className="text-dimmed">
        {project.author && (
          <>
            by{" "}
            <UserLink
              userId={project.createdUserId}
              name={project.author}
              className="text-highlighted underline decoration-dotted"
              fallbackClassName="text-default"
            />
            {project.publishedTs && <> ({wireYear(project.publishedTs)})</>}
            {" · "}
          </>
        )}
        {project.language && <>Made with {project.language} · </>}
        {project.viewCount != null && (
          <>{project.viewCount.toLocaleString()} views</>
        )}
      </span>
    </CmsMasthead>
  );
}

function ProjectNews({ news }: { news: Project["news"] }) {
  return (
    <section aria-label="Project news" className="space-y-2">
      <h2 className="border-b-2 border-default pb-1 font-bold tracking-widest text-xs">
        NEWS
      </h2>
      {news.map((entry) => (
        <BBPanel
          as="article"
          key={`${entry.threadId}:${entry.publishedTs}:${entry.subject}`}
          className="p-2.5"
        >
          {entry.subject && <p className="font-bold">{entry.subject}</p>}
          <p className="text-xs text-dimmed">
            {entry.authorName && (
              <>
                by{" "}
                <UserLink userId={entry.authorUserId} name={entry.authorName} />
              </>
            )}
            {entry.publishedTs && (
              <>
                {" · "}
                <BBDate dateStr={entry.publishedTs} />
              </>
            )}
          </p>
          {entry.body && (
            <p className="mt-1 whitespace-pre-wrap">{entry.body}</p>
          )}
          {entry.threadId && (
            <BBLink
              to={`/forum/thread/${entry.threadId}/1`}
              className="text-xs text-highlighted"
            >
              {entry.threadName
                ? `Read "${entry.threadName}"`
                : "Read the news topic"}
              <Fa6SolidArrowRight aria-hidden className="ml-1 inline" />
            </BBLink>
          )}
        </BBPanel>
      ))}
    </section>
  );
}

function ProjectSidebar({ project }: { project: Project }) {
  return (
    <aside aria-label="Project details">
      <BBPanel
        as="dl"
        className="text-xs [&_dt]:border-b [&_dt]:border-default/40 [&_dt]:bg-accented [&_dt]:px-2.5 [&_dt]:py-1 [&_dt]:font-bold [&_dt]:tracking-widest [&_dd]:border-b [&_dd]:border-default/40 [&_dd]:px-2.5 [&_dd]:py-1.5"
      >
        <dt>AUTHOR</dt>
        <dd>
          <UserLink
            userId={project.createdUserId}
            name={
              project.author ?? (project.createdUserId ? "profile" : "unknown")
            }
          />
        </dd>
        {project.team && (
          <>
            <dt>TEAM</dt>
            <dd>
              <span className="font-bold">{project.team.name}</span>
              {project.team.members.length > 0 && (
                <ul className="mt-1 list-none space-y-0.5">
                  {project.team.members.map((member) => (
                    <li key={member.userId}>
                      <UserLink
                        userId={member.userId}
                        name={member.displayName ?? `member #${member.userId}`}
                      />
                      {member.memberRole && (
                        <span className="text-dimmed">
                          {" "}
                          — {member.memberRole}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </dd>
          </>
        )}
        {project.publishedTs && (
          <>
            <dt>PUBLISHED</dt>
            <dd>
              <BBDate dateStr={project.publishedTs} />
            </dd>
          </>
        )}
        {project.lastUpdatedTs && (
          <>
            <dt>LAST UPDATED</dt>
            <dd>
              <BBDate dateStr={project.lastUpdatedTs} />
            </dd>
          </>
        )}
        {project.language && (
          <>
            <dt>LANGUAGE</dt>
            <dd>{project.language}</dd>
          </>
        )}
        {project.requirements && (
          <>
            <dt>REQUIREMENTS</dt>
            <dd>{project.requirements}</dd>
          </>
        )}
        {project.rating != null && (project.voteCount ?? 0) > 0 && (
          <>
            <dt>RATING</dt>
            <dd
              aria-label={`Rated ${project.rating.toFixed(1)} out of 5 from ${project.voteCount} votes`}
            >
              <span aria-hidden className="inline-flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, index) =>
                  index < Math.round(project.rating ?? 0) ? (
                    <Fa6SolidStar key={index} />
                  ) : (
                    <Fa6RegularStar key={index} />
                  ),
                )}
              </span>{" "}
              {project.rating.toFixed(1)}{" "}
              <span className="text-dimmed">({project.voteCount} votes)</span>
            </dd>
          </>
        )}
        <dt>VIEWS</dt>
        <dd>{(project.viewCount ?? 0).toLocaleString()}</dd>
        {(project.downloadCount ?? 0) > 0 && (
          <>
            <dt>DOWNLOADS</dt>
            <dd>{project.downloadCount!.toLocaleString()}</dd>
          </>
        )}
        {project.tags.length > 0 && (
          <>
            <dt>TAGS</dt>
            <dd className="flex flex-wrap gap-1">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-default bg-accented px-1.5 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </dd>
          </>
        )}
      </BBPanel>
    </aside>
  );
}

function ProjectOverview({ project }: { project: Project }) {
  return (
    <div className="grid gap-4 text-sm md:grid-cols-[1fr_260px]">
      <div className="space-y-4 min-w-0">
        {project.page?.contentParsed ? (
          <BBHtml
            html={project.page.contentParsed}
            className="whitespace-pre-wrap"
          />
        ) : (
          <p className="text-dimmed">This project doesn't have a page yet.</p>
        )}
        {project.news.length > 0 && <ProjectNews news={project.news} />}
        <ReactionsProvider reactableType="PROJECT" reactableIds={[project.id]}>
          <ReactionBar
            reactableId={project.id}
            className="border-t-2 border-default pt-3"
          />
        </ReactionsProvider>
      </div>
      <ProjectSidebar project={project} />
    </div>
  );
}

function ProjectDownloadRow({
  download,
}: {
  download: Project["downloads"][number];
}) {
  return (
    <li>
      <BBDownloadLink
        contentResourceId={download.contentResourceId!}
        filename={download.filename}
        className="text-highlighted"
      >
        {download.label || download.filename || "Download"}
      </BBDownloadLink>
      {download.label && download.filename && (
        <span className="text-xs text-dimmed"> ({download.filename})</span>
      )}
      <span className="text-xs text-dimmed">
        {download.fileSize != null && download.fileSize > 0 && (
          <> · {formatFileSize(download.fileSize)}</>
        )}
        {download.publishedTs && (
          <>
            {" · "}
            <BBDate dateStr={download.publishedTs} />
          </>
        )}
      </span>
      {download.filename?.toLowerCase().endsWith(".zip") && (
        <BBArchiveContents
          contentResourceId={download.contentResourceId!}
          filename={download.filename}
        />
      )}
    </li>
  );
}

function ProjectDownloads({ downloads }: { downloads: Project["downloads"] }) {
  return (
    <ul className="space-y-2 text-sm">
      {downloads.map((download) => (
        <ProjectDownloadRow
          key={download.contentResourceId}
          download={download}
        />
      ))}
    </ul>
  );
}

function ProjectDetail({ slug }: { slug: string }) {
  const [tab, setTab] = useState<ProjectTab>("overview");
  const query = useBBQuery(`/projects/${slug}`, {
    schema: ProjectSchema,
  });

  return (
    <BBQueryBoundary query={query}>
      {(project) => {
        const screenshots = project.screenshots.filter(
          (screenshot) => screenshot.contentResourceId,
        );
        const downloads = project.downloads.filter(
          (download) => download.contentResourceId,
        );

        return (
          <CmsDetailShell entityPath={`/projects/${slug}`}>
            <div>
              <Masthead project={project} />
              <nav className="flex items-end border-t-2 border-default bg-accented px-2 pt-2">
                <BBNavTab
                  title="Overview"
                  active={tab === "overview"}
                  onClick={() => setTab("overview")}
                />
                {screenshots.length > 0 && (
                  <BBNavTab
                    title="Screenshots"
                    count={screenshots.length}
                    active={tab === "screenshots"}
                    onClick={() => setTab("screenshots")}
                  />
                )}
                {downloads.length > 0 && (
                  <BBNavTab
                    title="Downloads"
                    count={downloads.length}
                    active={tab === "downloads"}
                    onClick={() => setTab("downloads")}
                  />
                )}
                {project.page && (
                  <BBNavTab title="Wiki" to={`/wiki/Project:${project.slug}`} />
                )}
              </nav>
              <section className="border-2 border-default bg-accented p-4">
                {tab === "overview" && <ProjectOverview project={project} />}
                {tab === "screenshots" && (
                  <BBGallery
                    images={screenshots.map((screenshot) => ({
                      contentResourceId: screenshot.contentResourceId!,
                      caption: screenshot.caption,
                    }))}
                  />
                )}
                {tab === "downloads" && (
                  <ProjectDownloads downloads={downloads} />
                )}
              </section>
            </div>
          </CmsDetailShell>
        );
      }}
    </BBQueryBoundary>
  );
}

export default function ProjectPage({ params }: Route.ComponentProps) {
  return <ProjectDetail slug={params.slug!} />;
}
