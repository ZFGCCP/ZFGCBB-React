import { useState } from "react";
import { Navigate, useSearchParams } from "react-router";

export function AllPages() {
  const { data: config } = useWikiConfig();
  const [searchParams, setSearchParams] = useSearchParams();
  const namespace = searchParams.get("ns") ?? "";
  const filterText = searchParams.get("q") ?? "";
  const pageNo = Number(searchParams.get("page") ?? "1");
  const query = new URLSearchParams({ page: String(pageNo), pageSize: "50" });
  if (namespace) query.set("namespace", namespace);
  if (filterText) query.set("search", filterText);
  const { data } = useBBQuery<Paged<WikiPageRef>>(
    `/wiki/meta/pages?${query.toString()}`,
  );
  const totalPages = data
    ? Math.max(1, Math.ceil(data.total / data.pageSize))
    : 1;

  const apply = (next: {
    namespace?: string;
    filterText?: string;
    page?: number;
  }) => {
    setSearchParams(
      (params) => {
        const merged = new URLSearchParams(params);
        if (next.namespace !== undefined) merged.set("ns", next.namespace);
        if (next.filterText !== undefined) merged.set("q", next.filterText);
        merged.set("page", String(next.page ?? 1));
        for (const key of ["ns", "q"]) if (!merged.get(key)) merged.delete(key);
        if (merged.get("page") === "1") merged.delete("page");
        return merged;
      },
      { replace: true },
    );
  };

  return (
    <BBWidget widgetTitle="All pages">
      <div className="space-y-3 p-4">
        <form
          role="search"
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-wrap gap-1.5"
        >
          <input
            type="search"
            defaultValue={filterText}
            placeholder="Filter by title…"
            aria-label="Filter pages by title"
            onChange={(event) => apply({ filterText: event.target.value })}
            className="grow min-w-48 border-2 border-default bg-muted px-3 py-1.5 text-sm placeholder:text-dimmed focus:bg-elevated focus:outline-none"
          />
          {(config?.namespaces ?? []).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={namespace === option}
              className={`border-2 border-default px-2 py-1 text-xs cursor-pointer ${
                namespace === option
                  ? "bg-accented text-highlighted font-bold"
                  : "bg-muted hover:bg-elevated"
              }`}
              onClick={() =>
                apply({ namespace: namespace === option ? "" : option })
              }
            >
              {option}
            </button>
          ))}
          {data && (
            <span
              aria-live="polite"
              className="ml-auto self-center text-xs text-dimmed"
            >
              {data.total} pages
            </span>
          )}
        </form>
        <WikiPageList refs={data?.items ?? []} />
        {totalPages > 1 && (
          <BBPaginator
            numPages={totalPages}
            currentPage={pageNo}
            onPageChange={(next) => apply({ page: next })}
          />
        )}
      </div>
    </BBWidget>
  );
}

export function WikiStatistics() {
  const { data } = useBBQuery<{
    totalPages: number;
    byNamespace: Record<string, number>;
    categories: number;
    redirects: number;
  }>("/wiki/meta/statistics");
  return (
    <BBWidget widgetTitle="Statistics">
      <div className="p-4 text-sm">
        {data && (
          <BBPanel
            as="dl"
            className="max-w-md [&_dt]:border-b [&_dt]:border-default/40 [&_dt]:bg-accented [&_dt]:px-2.5 [&_dt]:py-1 [&_dt]:text-xs [&_dt]:font-bold [&_dt]:tracking-widest [&_dd]:border-b [&_dd]:border-default/40 [&_dd]:px-2.5 [&_dd]:py-1.5"
          >
            <dt>TOTAL PAGES</dt>
            <dd>{data.totalPages.toLocaleString()}</dd>
            <dt>CATEGORIES</dt>
            <dd>{data.categories.toLocaleString()}</dd>
            <dt>REDIRECTS</dt>
            <dd>{data.redirects.toLocaleString()}</dd>
            <dt>PAGES BY NAMESPACE</dt>
            <dd>
              <ul className="space-y-0.5">
                {Object.entries(data.byNamespace).map(([namespace, count]) => (
                  <li key={namespace}>
                    <BBLink
                      to={`/wiki/special/allpages?ns=${namespace}`}
                      className="text-highlighted"
                    >
                      {namespace}
                    </BBLink>{" "}
                    <span className="text-dimmed">({count})</span>
                  </li>
                ))}
              </ul>
            </dd>
          </BBPanel>
        )}
      </div>
    </BBWidget>
  );
}

export function CategoryIndex() {
  const { data: categories } = useBBQuery<WikiCategoryCount[]>(
    "/wiki/meta/categories",
  );
  return (
    <BBWidget widgetTitle="Categories">
      <ul className="md:columns-3 p-4 text-sm [&_li]:break-inside-avoid">
        {(categories ?? []).map((category) => (
          <li key={category.name}>
            <BBLink
              to={`/wiki/Category:${category.name.replace(/ /g, "_")}`}
              className="text-highlighted"
            >
              {category.name}
            </BBLink>{" "}
            <span className="text-dimmed">({category.count})</span>
          </li>
        ))}
      </ul>
    </BBWidget>
  );
}

export function RecentChanges() {
  const { data: changes } = useBBQuery<WikiRevisionRef[]>(
    "/wiki/meta/recentchanges",
  );
  return (
    <BBWidget widgetTitle="Recent changes">
      <div className="p-4">
        <WikiTimeline>
          {(changes ?? []).map((change) => (
            <WikiTimelineItem key={change.revisionId} summary={change.summary}>
              <span className="text-xs text-dimmed">
                <BBDate dateStr={change.authoredTs} fallback="unknown date" />
              </span>
              {change.page && (
                <BBLink
                  to={
                    change.current
                      ? `/wiki/${change.page.slug}`
                      : `/wiki/${change.page.slug}?rev=${change.revisionId}`
                  }
                  className="font-bold text-highlighted"
                >
                  <WikiRefLabel
                    namespace={change.page.namespace}
                    title={change.page.title}
                  />
                </BBLink>
              )}
              {change.authorName && <span>{change.authorName}</span>}
            </WikiTimelineItem>
          ))}
        </WikiTimeline>
      </div>
    </BBWidget>
  );
}

export function RandomPage() {
  const { data } = useBBQuery<Paged<WikiPageRef>>(
    "/wiki/meta/pages?page=1&pageSize=1",
  );
  const [pick] = useState(() => Math.random());
  if (!data) return null;
  return <RandomPick index={Math.floor(pick * data.total)} />;
}

function RandomPick({ index }: { index: number }) {
  const { data } = useBBQuery<Paged<WikiPageRef>>(
    `/wiki/meta/pages?page=${index + 1}&pageSize=1`,
  );
  const target = data?.items[0];
  if (!target) return null;
  return <Navigate to={`/wiki/${target.slug}`} replace />;
}

export function UnknownSpecialPage({ name }: { name: string }) {
  return (
    <BBWidget widgetTitle={name}>
      <p className="p-4 text-sm text-dimmed">
        This special page isn't available. Try{" "}
        <BBLink to="/wiki/special/allpages" className="text-highlighted">
          All pages
        </BBLink>
        ,{" "}
        <BBLink to="/wiki/special/categories" className="text-highlighted">
          Categories
        </BBLink>{" "}
        or{" "}
        <BBLink to="/wiki/special/statistics" className="text-highlighted">
          Statistics
        </BBLink>
        .
      </p>
    </BBWidget>
  );
}
