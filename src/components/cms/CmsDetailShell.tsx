import type { RoutePaths } from "@/components/common/BBLink";

export function CmsDetailShell({
  sectionLabel,
  basePath,
  title,
  entityPath,
  children,
}: {
  sectionLabel: string;
  basePath: RoutePaths;
  title: string;
  entityPath: `/${string}`;
  children: React.ReactNode;
}) {
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  const backTo = (from?.startsWith(basePath) ? from : basePath) as RoutePaths;
  const crumbs = [
    { label: "Home", to: "/" as const },
    { label: sectionLabel, to: backTo },
    { label: title },
  ];

  return (
    <div className="space-y-4">
      <BBBreadcrumb crumbs={crumbs} />
      {children}
      <EntityDiscussion entityPath={entityPath} />
      <BBBreadcrumb crumbs={crumbs} />
    </div>
  );
}
