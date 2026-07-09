import type { Project, ProjectFacets, ProjectShowcase } from "@/types/content";
import type { CatalogParamMap } from "@/hooks/useCatalog";
import type { CmsCatalogDescriptor } from "@/types/catalogDescriptor";
import { ProjectCardBodyCatalog } from "@/components/cms/catalogs/ProjectCardBodyCatalog";

const PROJECT_PARAMS: CatalogParamMap = { filter: "status", language: "lang" };

export const projectCatalog: CmsCatalogDescriptor<
  Project,
  ProjectShowcase,
  ProjectFacets
> = {
  heading: "PROJECTS",
  crumb: "Projects",
  api: "/projects",
  basePath: "/content/projects",
  params: PROJECT_PARAMS,
  searchPlaceholder: "Search projects by title…",
  sortOptions: [
    { value: "", label: "A - Z" },
    { value: "newest", label: "Newest" },
    { value: "updated", label: "Recently updated" },
    { value: "rating", label: "Top rated" },
    { value: "views", label: "Most viewed" },
    { value: "downloads", label: "Most downloaded" },
  ],
  kicker: "Featured Project",
  carouselTitle: "Recent Projects",
  viewAllLabel: "View all projects",
  total: (showcase) => showcase.totalProjects,
  card: (project) => <ProjectCardBodyCatalog project={project} />,
  featured: (project) => ({
    previewId: project.previewContentResourceId,
    title: project.title,
    author: project.author,
    status: project.status,
    rating: project.rating,
    voteCount: project.voteCount,
    summary: project.summaryText,
    contentHtml: project.page?.contentParsed ?? null,
    href: `/content/projects/${project.slug}`,
    metaLine: project.language ?? undefined,
  }),
  randomSub: (project) => `${project.status} · ${project.author ?? "unknown"}`,
  topRatedSub: (project) =>
    project.rating != null ? (
      <>
        <Fa6SolidStar aria-hidden className="inline" />{" "}
        {project.rating.toFixed(1)} · {project.author ?? "unknown"}
      </>
    ) : (
      (project.author ?? "unknown")
    ),
  downloadsSub: (project) =>
    `${(project.downloadCount ?? 0).toLocaleString()} downloads · ${project.author ?? "unknown"}`,
  facetOptions: (facets) => ({
    filterOptions: facets?.statuses ?? [],
    languageOptions: facets?.languages,
  }),
};
