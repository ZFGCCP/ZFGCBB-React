import { useMemo } from "react";
import type { Project } from "./ProjectMasthead";
import { ProjectNews } from "./ProjectNews";
import { ProjectSidebar } from "./ProjectSidebar";

export function ProjectOverview({ project }: { project: Project }) {
  const reactableIds = useMemo(() => [project.id], [project.id]);

  return (
    <div className="grid gap-4 text-sm md:grid-cols-[1fr_260px]">
      <div className="space-y-4 min-w-0">
        {project.page?.contentParsed ? (
          <BBHtml
            html={project.page.contentParsed}
            className="whitespace-pre-wrap"
          />
        ) : (
          <p className="text-dimmed">
            This project doesn&apos;t have a page yet.
          </p>
        )}
        {project.news.length > 0 && <ProjectNews news={project.news} />}
        <ReactionsProvider reactableType="PROJECT" reactableIds={reactableIds}>
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
