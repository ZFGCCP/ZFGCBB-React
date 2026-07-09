import { type BBLinkProps, type RoutePaths } from "@/components/common/BBLink";

export type Crumb = {
  label: string;
  to?: RoutePaths;
  prefetch?: BBLinkProps["prefetch"];
};

export default function BBBreadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-2 py-2 text-sm"
    >
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <span
            key={`${crumb.label}-${index}`}
            className="flex items-center gap-2"
          >
            {index > 0 && (
              <span aria-hidden className="text-dimmed">
                &gt;&gt;
              </span>
            )}
            {crumb.to && !isLast ? (
              <BBLink
                to={crumb.to}
                prefetch={crumb.prefetch}
                className="text-highlighted hover:underline"
              >
                {crumb.label}
              </BBLink>
            ) : (
              <span
                aria-current={isLast ? "page" : undefined}
                className="text-dimmed"
              >
                {crumb.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
