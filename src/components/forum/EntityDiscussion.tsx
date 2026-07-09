import { useMutation, useQueryClient } from "@tanstack/react-query";

interface EntityDiscussionProps {
  entityPath: `/${string}`;
}

export default function EntityDiscussion({
  entityPath,
}: EntityDiscussionProps) {
  const queryClient = useQueryClient();
  const { data: entity } = useBBQuery(entityPath, {
    schema: EntityThreadRefSchema,
  });
  const threadId = entity?.threadId ?? null;
  const { data: thread, error: threadError } = useBBQuery(
    `/thread/${threadId}?page=0&pageSize=5`,
    { enabled: threadId != null, throwOnError: false, schema: ThreadSchema },
  );

  const startDiscussion = useMutation({
    mutationFn: async () => {
      const response = await apiFetch(
        `${getApiBaseUrl()}${entityPath}/discussion`,
        { method: "POST" },
      );
      return handleResponseWithJason<unknown>(response);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [entityPath] });
    },
  });

  const threadStatus = getResponseStatus(threadError ?? undefined);

  return (
    <BBWidget widgetTitle="Discussion">
      <div className="p-4 space-y-3">
        {entity && threadId == null && (
          <div className="flex items-center gap-3">
            <p className="text-sm text-dimmed grow">
              No discussion thread yet.
            </p>
            <BBHasPermission requiredPermissions={["ZFGC_USER"]}>
              <BBButton
                disabled={startDiscussion.isPending}
                onClick={() => startDiscussion.mutate()}
              >
                Start discussion
              </BBButton>
            </BBHasPermission>
          </div>
        )}
        {startDiscussion.isError && (
          <p className="text-sm text-error">
            {(startDiscussion.error as Error)?.message ??
              "Could not start the discussion."}
          </p>
        )}
        {threadId != null &&
          !thread &&
          threadError &&
          (threadStatus === 403 || threadStatus === 404 ? (
            <p className="text-sm text-dimmed">
              The discussion thread for this entry is not publicly viewable.
            </p>
          ) : (
            <p className="text-sm text-error">
              Could not load the discussion thread.
            </p>
          ))}
        {threadId != null && thread && (
          <>
            {(thread.messages ?? []).map((message) => (
              <BBPanel key={message.id ?? message.currentMessage?.messageId}>
                <p className="border-b-2 border-default px-2 py-1 text-xs text-dimmed">
                  {message.createdUser?.displayName ?? "Unknown"}
                  {message.createdTsAsString && (
                    <>
                      {" — "}
                      <BBDate dateStr={message.createdTsAsString} />
                    </>
                  )}
                </p>
                <BBHtml
                  html={message.currentMessage?.messageText ?? ""}
                  className="p-2 text-sm whitespace-pre-wrap"
                />
              </BBPanel>
            ))}
            <BBLink
              to={`/forum/thread/${threadId}/1`}
              className="text-sm text-highlighted"
            >
              Open the full thread{" "}
              <Fa6SolidArrowRight aria-hidden className="inline" />
            </BBLink>
          </>
        )}
      </div>
    </BBWidget>
  );
}
