import type { Route } from "./+types/route";
import {
  type BreadcrumbHandle,
  type Crumb,
} from "@/components/common/BBBreadcrumb";
import { entityRoute } from "@/shared/http/entityLoaders";
import { ProjectDetail } from "./ProjectView";

const route = entityRoute({
  url: (params: Route.LoaderArgs["params"]) => `/projects/${params.slug}`,
  schema: ProjectSchema,
  prefetch: (project, queryClient, headers) =>
    queryClient.prefetchQuery(
      reactionBatchQueryOptions("PROJECT", [project.id], headers),
    ),
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

export default function ProjectPage({ params }: Route.ComponentProps) {
  return <ProjectDetail slug={params.slug} />;
}
