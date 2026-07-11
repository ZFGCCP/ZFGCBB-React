import {
  useLocation,
  useMatches,
  type Location,
  type UIMatch,
} from "react-router";
import { type BBLinkProps, type RoutePaths } from "@/components/common/BBLink";

export type Crumb = {
  label: string;
  to?: RoutePaths;
  prefetch?: BBLinkProps["prefetch"];
};

type BreadcrumbValue = Crumb | Crumb[] | string;

export type BreadcrumbContext = { location: Location };

export type ThreadNavState = { fromBoardUrl?: string };

export type BreadcrumbHandle<TData = unknown> = {
  breadcrumb:
    | BreadcrumbValue
    | ((
        match: UIMatch<TData>,
        ctx: BreadcrumbContext,
      ) => BreadcrumbValue | null | undefined);
};

function toCrumbs(value: BreadcrumbValue | null | undefined): Crumb[] {
  if (value == null) return [];
  if (typeof value === "string") return [{ label: value }];
  return Array.isArray(value) ? value : [value];
}

function crumbsFromMatches(
  matches: UIMatch[],
  ctx: BreadcrumbContext,
): Crumb[] {
  return matches.flatMap((match) => {
    const breadcrumb = (match.handle as BreadcrumbHandle | undefined)
      ?.breadcrumb;
    if (breadcrumb == null) return [];
    return toCrumbs(
      typeof breadcrumb === "function" ? breadcrumb(match, ctx) : breadcrumb,
    );
  });
}

export default function BBBreadcrumb({ crumbs }: { crumbs?: Crumb[] }) {
  const matches = useMatches();
  const location = useLocation();
  const { data: siteInfo } = useSiteInfo();
  const trail = crumbs ?? crumbsFromMatches(matches, { location });
  if (trail.length === 0) return null;

  const fullTrail: Crumb[] = [
    { label: siteInfo?.siteName ?? "", to: "/", prefetch: "intent" },
    ...trail,
  ];

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex min-h-9 flex-wrap items-center gap-2 py-2 text-sm"
    >
      {fullTrail.map((crumb, index) => {
        const isLast = index === fullTrail.length - 1;
        return (
          <span
            key={crumb.to ?? crumb.label}
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
