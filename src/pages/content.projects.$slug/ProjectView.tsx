import { useCallback, useMemo, useState } from "react";
import type { Project } from "./ProjectMasthead";
import { ProjectMasthead } from "./ProjectMasthead";
import { ProjectOverview } from "./ProjectOverview";
import { ProjectDownloads } from "./ProjectDownloads";

export type ProjectTab = "overview" | "screenshots" | "downloads";

export function ProjectDetail({ slug }: { slug: string }) {
  const query = useBBQuery(`/projects/${slug}`, {
    schema: ProjectSchema,
  });

  return <BBQueryBoundary query={query}>{renderProject}</BBQueryBoundary>;
}

function renderProject(project: Project) {
  return <ProjectView project={project} />;
}

export function ProjectView({ project }: { project: Project }) {
  const [tab, setTab] = useState<ProjectTab>("overview");
  const screenshots = useMemo(
    () =>
      project.screenshots.filter((screenshot) => screenshot.contentResourceId),
    [project.screenshots],
  );
  const downloads = useMemo(
    () => project.downloads.filter((download) => download.contentResourceId),
    [project.downloads],
  );
  const galleryImages = useMemo(
    () =>
      screenshots.flatMap((screenshot) =>
        screenshot.contentResourceId
          ? [
              {
                contentResourceId: screenshot.contentResourceId,
                caption: screenshot.caption,
              },
            ]
          : [],
      ),
    [screenshots],
  );
  const showOverview = useCallback(() => {
    setTab("overview");
  }, []);
  const showScreenshots = useCallback(() => {
    setTab("screenshots");
  }, []);
  const showDownloads = useCallback(() => {
    setTab("downloads");
  }, []);

  return (
    <CmsDetailShell entityPath={`/projects/${project.slug}`}>
      <div>
        <ProjectMasthead project={project} />
        <nav className="flex items-end border-t-2 border-default bg-accented px-2 pt-2">
          <BBNavTab
            title="Overview"
            active={tab === "overview"}
            onClick={showOverview}
          />
          {screenshots.length > 0 && (
            <BBNavTab
              title="Screenshots"
              count={screenshots.length}
              active={tab === "screenshots"}
              onClick={showScreenshots}
            />
          )}
          {downloads.length > 0 && (
            <BBNavTab
              title="Downloads"
              count={downloads.length}
              active={tab === "downloads"}
              onClick={showDownloads}
            />
          )}
          {project.page && (
            <BBNavTab
              title="Wiki"
              to={`/wiki/${encodeWikiPath(project.page.slug)}`}
            />
          )}
        </nav>
        <section className="border-2 border-default bg-accented p-4">
          {tab === "overview" && <ProjectOverview project={project} />}
          {tab === "screenshots" && <BBGallery images={galleryImages} />}
          {tab === "downloads" && <ProjectDownloads downloads={downloads} />}
        </section>
      </div>
    </CmsDetailShell>
  );
}
