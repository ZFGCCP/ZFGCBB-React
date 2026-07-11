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

  return (
    <BBWidget widgetTitle="Pending revisions">
      <div className="p-4 space-y-4">
        <BBQueryBoundary
          query={query}
          isEmpty={(pending) => !pending.length}
          empty={<BBEmpty message="Nothing waiting for review." />}
        >
          {(pending) => (
            <ul className="space-y-3">
              {pending.map((revision) => (
                <li
                  key={revision.revisionId}
                  className="border-2 border-default bg-accented p-3"
                >
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
                        <BBDate
                          dateStr={revision.authoredTs}
                          fallback="unknown date"
                        />
                        {revision.summary && (
                          <span> &middot; {revision.summary}</span>
                        )}
                      </div>
                    </div>
                    <BBButton
                      size="xs"
                      onClick={() =>
                        setPreviewId(
                          previewId === revision.revisionId
                            ? null
                            : revision.revisionId,
                        )
                      }
                    >
                      {previewId === revision.revisionId
                        ? "Hide preview"
                        : "Preview"}
                    </BBButton>
                    <BBButton
                      size="xs"
                      disabled={act.isPending}
                      onClick={() =>
                        act.mutate({
                          revisionId: revision.revisionId,
                          action: "approve",
                        })
                      }
                    >
                      Approve
                    </BBButton>
                    <BBButton
                      size="xs"
                      disabled={act.isPending}
                      onClick={() =>
                        act.mutate({
                          revisionId: revision.revisionId,
                          action: "reject",
                        })
                      }
                    >
                      Reject
                    </BBButton>
                  </div>
                  {previewId === revision.revisionId && previewQuery.data && (
                    <div className="mt-3 border-t border-default pt-3">
                      <BBHtml
                        html={previewQuery.data.contentParsed}
                        className="whitespace-pre-wrap"
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </BBQueryBoundary>
      </div>
    </BBWidget>
  );
}
