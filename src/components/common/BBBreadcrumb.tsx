import {
  useLocation,
  useMatches,
  type Location,
  type UIMatch,
} from "react-router";
import { type BBLinkProps, type RoutePaths } from "@/components/common/BBLink";

export type Crumb = {
  label: string;
  to?: RoutePaths | undefined;
  prefetch?: BBLinkProps["prefetch"] | undefined;
};

type BreadcrumbValue = Crumb | Crumb[] | string;

export type BreadcrumbContext = { location: Location };

export type ThreadNavState = { fromBoardUrl?: string | undefined };

export type BreadcrumbHandle<TData = unknown> = {
  breadcrumb:
    | BreadcrumbValue
    | ((
        match: UIMatch<TData>,
        ctx: BreadcrumbContext,
      ) => BreadcrumbValue | null | undefined);
};

function toCrumbs(value: BreadcrumbValue | null | undefined): Crumb[] {
  if (value === null || value === undefined) return [];
  if (typeof value === "string") return [{ label: value }];
  return Array.isArray(value) ? value : [value];
}

function isCrumb(value: unknown): value is Crumb {
  if (
    typeof value !== "object" ||
    value === null ||
    value === undefined ||
    !("label" in value)
  ) {
    return false;
  }
  if (typeof value.label !== "string") return false;
  if ("to" in value && value.to !== undefined && typeof value.to !== "string") {
    return false;
  }
  return true;
}

function isBreadcrumbValue(value: unknown): value is BreadcrumbValue {
  return (
    typeof value === "string" ||
    isCrumb(value) ||
    (Array.isArray(value) && value.every((entry) => isCrumb(entry)))
  );
}

function isBreadcrumbHandle(value: unknown): value is BreadcrumbHandle {
  if (
    typeof value !== "object" ||
    value === null ||
    value === undefined ||
    !("breadcrumb" in value)
  ) {
    return false;
  }
  return (
    typeof value.breadcrumb === "function" ||
    isBreadcrumbValue(value.breadcrumb)
  );
}

function crumbsFromMatches(
  matches: UIMatch[],
  ctx: BreadcrumbContext,
): Crumb[] {
  return matches.flatMap((match) => {
    if (!isBreadcrumbHandle(match.handle)) return [];
    const { breadcrumb } = match.handle;
    if (breadcrumb === null || breadcrumb === undefined) return [];
    return toCrumbs(
      typeof breadcrumb === "function" ? breadcrumb(match, ctx) : breadcrumb,
    );
  });
}

export default function BBBreadcrumb({
  crumbs,
  decorative = false,
}: {
  crumbs?: Crumb[];
  decorative?: boolean;
}) {
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
      {...(decorative
        ? { "aria-hidden": true as const }
        : { "aria-label": "Breadcrumb" })}
      className={`flex min-h-9 flex-wrap items-center gap-2 py-2 text-sm${
        decorative ? " mt-2 border-t border-default pt-3" : ""
      }`}
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
                {...(crumb.prefetch ? { prefetch: crumb.prefetch } : {})}
                {...(decorative ? { tabIndex: -1 } : {})}
                className="text-highlighted hover:underline"
              >
                {crumb.label}
              </BBLink>
            ) : (
              <span
                aria-current={isLast && !decorative ? "page" : undefined}
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
