export default function RecentChanges() {
  const query = useBBQuery("/wiki/meta/recentchanges", {
    schema: WikiRevisionRefListSchema,
  });
  return (
    <BBWidget widgetTitle="Recent changes">
      <div className="p-4">
        <BBQueryBoundary
          query={query}
          isEmpty={(changes) => !changes.length}
          empty={<BBEmpty message="No recent changes." />}
        >
          {(changes) => (
            <WikiTimeline>
              {changes.map((change) => (
                <WikiTimelineItem
                  key={change.revisionId}
                  summary={change.summary}
                >
                  <span className="text-xs text-dimmed">
                    <BBDate
                      dateStr={change.authoredTs}
                      fallback="unknown date"
                    />
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
          )}
        </BBQueryBoundary>
      </div>
    </BBWidget>
  );
}
