import { useMemo } from "react";
import type * as v from "valibot";

export type Project = v.InferOutput<typeof ProjectSchema>;

export function ProjectMasthead({ project }: { project: Project }) {
  const steveId =
    project.screenshots.find((screenshot) => screenshot.contentResourceId)
      ?.contentResourceId ?? project.previewContentResourceId;
  const progressStyle = useMemo(
    () => ({ width: `${Math.min(100, project.progress)}%` }),
    [project.progress],
  );

  return (
    <CmsMasthead steveId={steveId ?? undefined} title={project.title}>
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
              style={progressStyle}
            />
          </BBPanel>
          <span className="text-xs text-dimmed">{project.progress}%</span>
        </span>
      )}
      {project.rating !== null &&
        project.rating !== undefined &&
        (project.voteCount ?? 0) > 0 && (
          <RatingBadge
            rating={project.rating}
            voteCount={project.voteCount ?? 0}
          />
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
        {project.viewCount !== null && project.viewCount !== undefined && (
          <>{project.viewCount.toLocaleString()} views</>
        )}
      </span>
    </CmsMasthead>
  );
}
