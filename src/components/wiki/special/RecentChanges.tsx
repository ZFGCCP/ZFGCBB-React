import type { WikiRevisionRef } from "@/types/content";

const RECENT_CHANGES_EMPTY_STATE = <BBEmpty message="No recent changes." />;
const isRecentChangesEmpty = (changes: WikiRevisionRef[]) => !changes.length;
const renderRecentChanges = (changes: WikiRevisionRef[]) => (
  <WikiTimeline>
    {changes.map((change) => (
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
);

export default function RecentChanges() {
  const query = useBBQuery("/wiki/meta/recentchanges", {
    schema: WikiRevisionRefListSchema,
  });
  return (
    <BBWidget widgetTitle="Recent changes">
      <div className="p-4">
        <BBQueryBoundary
          query={query}
          isEmpty={isRecentChangesEmpty}
          empty={RECENT_CHANGES_EMPTY_STATE}
        >
          {renderRecentChanges}
        </BBQueryBoundary>
      </div>
    </BBWidget>
  );
}
