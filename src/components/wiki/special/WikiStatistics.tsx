export default function WikiStatistics() {
  const query = useBBQuery("/wiki/meta/statistics", {
    schema: WikiStatisticsSchema,
  });
  return (
    <BBWidget widgetTitle="Statistics">
      <div className="p-4 text-sm">
        <BBQueryBoundary query={query}>
          {(data) => (
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
                  {Object.entries(data.byNamespace).map(
                    ([namespace, count]) => (
                      <li key={namespace}>
                        <BBLink
                          to={`/wiki/special/allpages?ns=${namespace}`}
                          className="text-highlighted"
                        >
                          {namespace}
                        </BBLink>{" "}
                        <span className="text-dimmed">({count})</span>
                      </li>
                    ),
                  )}
                </ul>
              </dd>
            </BBPanel>
          )}
        </BBQueryBoundary>
      </div>
    </BBWidget>
  );
}
