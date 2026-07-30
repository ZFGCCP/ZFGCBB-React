import * as v from "valibot";

import type { WikiRevisionRef } from "@/types/content";

type ModerationAction = "approve" | "reject";

const MODERATION_EMPTY_STATE = (
  <BBEmpty message="Nothing waiting for review." />
);
const isModerationQueueEmpty = (pending: WikiRevisionRef[]) => !pending.length;

function ModerationItem({
  revision,
  previewId,
  previewHtml,
  pending,
  onPreview,
  onAction,
}: {
  revision: WikiRevisionRef;
  previewId: number | null;
  previewHtml?: string;
  pending: boolean;
  onPreview: (revisionId: number) => void;
  onAction: (revisionId: number, action: ModerationAction) => void;
}) {
  const isPreviewed = previewId === revision.revisionId;
  const handlePreview = useCallback(
    () => onPreview(revision.revisionId),
    [onPreview, revision.revisionId],
  );
  const handleApprove = useCallback(
    () => onAction(revision.revisionId, "approve"),
    [onAction, revision.revisionId],
  );
  const handleReject = useCallback(
    () => onAction(revision.revisionId, "reject"),
    [onAction, revision.revisionId],
  );

  return (
    <li className="border-2 border-default bg-accented p-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="grow">
          {revision.page && (
            <BBLink
              to={`/wiki/${revision.page.slug}?rev=${revision.revisionId}`}
              className="font-bold text-highlighted"
            >
              <WikiRefLabel
                namespace={revision.page.namespace}
                title={revision.page.title}
              />
            </BBLink>
          )}
          <div className="text-xs text-dimmed">
            {revision.authorName && (
              <span>{revision.authorName} &middot; </span>
            )}
            <BBDate dateStr={revision.authoredTs} fallback="unknown date" />
            {revision.summary && <span> &middot; {revision.summary}</span>}
          </div>
        </div>
        <BBButton size="xs" onClick={handlePreview}>
          {isPreviewed ? "Hide preview" : "Preview"}
        </BBButton>
        <BBButton size="xs" disabled={pending} onClick={handleApprove}>
          Approve
        </BBButton>
        <BBButton size="xs" disabled={pending} onClick={handleReject}>
          Reject
        </BBButton>
      </div>
      {isPreviewed && previewHtml && (
        <div className="mt-3 border-t border-default pt-3">
          <BBHtml html={previewHtml} className="whitespace-pre-wrap" />
        </div>
      )}
    </li>
  );
}

export default function ModerationQueue() {
  const [previewId, setPreviewId] = useState<number | null>(null);
  const query = useBBQuery("/wiki/meta/moderation/pending", {
    schema: WikiRevisionRefListSchema,
    meta: { userScoped: true },
  });
  const previewQuery = useBBQuery(
    `/wiki/meta/moderation/${previewId ?? 0}/preview`,
    {
      schema: WikiPreviewSchema,
      enabled: previewId != null,
      meta: { userScoped: true },
    },
  );
  const act = useBBMutation({
    schema: v.undefined(),
    invalidateKeys: [["/wiki/meta/moderation/pending"]],
    request: (variables: {
      revisionId: number;
      action: "approve" | "reject";
    }) => ({
      url: `/wiki/meta/moderation/${variables.revisionId}/${variables.action}`,
      method: "POST",
    }),
    onSuccess: () => setPreviewId(null),
  });
  const handlePreview = useCallback(
    (revisionId: number) =>
      setPreviewId((current) => (current === revisionId ? null : revisionId)),
    [],
  );
  const handleAction = useCallback(
    (revisionId: number, action: ModerationAction) =>
      act.mutate({ revisionId, action }),
    [act],
  );
  const renderPending = useCallback(
    (pending: WikiRevisionRef[]) => (
      <ul className="space-y-3">
        {pending.map((revision) => (
          <ModerationItem
            key={revision.revisionId}
            revision={revision}
            previewId={previewId}
            previewHtml={
              previewId === revision.revisionId
                ? previewQuery.data?.contentParsed
                : undefined
            }
            pending={act.isPending}
            onPreview={handlePreview}
            onAction={handleAction}
          />
        ))}
      </ul>
    ),
    [
      act.isPending,
      handleAction,
      handlePreview,
      previewId,
      previewQuery.data?.contentParsed,
    ],
  );

  return (
    <BBWidget widgetTitle="Pending revisions">
      <div className="p-4 space-y-4">
        <BBQueryBoundary
          query={query}
          isEmpty={isModerationQueueEmpty}
          empty={MODERATION_EMPTY_STATE}
        >
          {renderPending}
        </BBQueryBoundary>
      </div>
    </BBWidget>
  );
}
