import type { Project } from "@/types/content";

export function ProjectCardBodyCatalog({ project }: { project: Project }) {
  const location = useLocation();
  const year = project.publishedTs
    ? new Date(project.publishedTs).getFullYear()
    : null;
  return (
    <BBLink
      to={`/content/projects/${project.slug}`}
      state={{ from: `${location.pathname}${location.search}` }}
      aria-label={`${project.title}, ${project.status}, by ${project.author ?? "unknown author"}`}
      className="group flex w-full flex-col border-2 border-default bg-muted transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <div className="relative h-32 overflow-hidden border-b-2 border-default">
        <Thumb
          previewId={project.previewContentResourceId}
          title={project.title}
          className="h-full w-full transition duration-200 motion-safe:group-hover:scale-105"
          letterClassName="text-4xl"
        />
        <span className="absolute right-1.5 top-1.5 border-2 border-default bg-accented/90 px-1.5 py-0.5 text-[10px] font-bold tracking-widest text-highlighted">
          {project.status}
        </span>
      </div>
      <div className="flex grow flex-col gap-1 p-2.5">
        <p className="font-bold leading-tight">{project.title}</p>
        <p className="text-xs text-dimmed">
          by <span className="text-default">{project.author ?? "unknown"}</span>
          {year && ` · ${year}`}
        </p>
        {project.tags.length > 0 && (
          <p className="flex flex-wrap gap-1">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="border border-default bg-accented px-1 py-0.5 text-[10px] text-dimmed"
              >
                {tag}
              </span>
            ))}
          </p>
        )}
        {project.progress > 0 && (
          <progress
            value={Math.min(100, project.progress)}
            max={100}
            aria-label={`Progress ${project.progress}%`}
            className="mt-1 block h-2 w-full appearance-none border border-default bg-accented [&::-moz-progress-bar]:bg-progress-hatch [&::-webkit-progress-bar]:bg-accented [&::-webkit-progress-value]:bg-progress-hatch"
          />
        )}
        <p className="mt-auto pt-1 text-[11px] text-dimmed">
          {project.rating != null && (project.voteCount ?? 0) > 0 && (
            <span
              aria-label={`Rated ${project.rating.toFixed(1)} out of 5 from ${project.voteCount} votes`}
            >
              <Fa6SolidStar aria-hidden className="inline" />{" "}
              {project.rating.toFixed(1)} ·{" "}
            </span>
          )}
          {project.language && <>{project.language} · </>}
          {(project.viewCount ?? 0).toLocaleString()} views
          {project.downloadCount != null && project.downloadCount > 0 && (
            <> · {project.downloadCount.toLocaleString()} downloads</>
          )}
        </p>
      </div>
    </BBLink>
  );
}
