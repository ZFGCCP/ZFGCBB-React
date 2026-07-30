import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as v from "valibot";

const DISCUSSION_PERMISSION = ["ZFGC_USER"] as const;

interface EntityDiscussionProps {
  entityPath: `/${string}`;
}

export default function EntityDiscussion({
  entityPath,
}: EntityDiscussionProps) {
  const queryClient = useQueryClient();
  const discussionKey = `${entityPath}::discussion`;
  const { data: entity } = useBBQuery(entityPath, {
    schema: EntityThreadRefSchema,
    queryKey: discussionKey,
  });
  const threadId = entity?.threadId ?? null;
  const { data: thread, error: threadError } = useBBQuery(
    `/thread/${threadId}?page=0&pageSize=5`,
    {
      enabled: threadId !== null && threadId !== undefined,
      throwOnError: false,
      schema: ThreadSchema,
    },
  );

  const startDiscussion = useMutation({
    mutationFn: async () => {
      const response = await apiFetch(
        `${getApiBaseUrl()}${entityPath}/discussion`,
        { method: "POST" },
      );
      return handleResponseWithJason(response, v.unknown());
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [discussionKey] });
    },
  });
  const handleStartDiscussion = useCallback(() => {
    startDiscussion.mutate();
  }, [startDiscussion]);

  const threadStatus = getResponseStatus(threadError ?? undefined);

  return (
    <BBWidget widgetTitle="Discussion">
      <div className="p-4 space-y-3">
        {entity && (threadId === null || threadId === undefined) && (
          <div className="flex items-center gap-3">
            <p className="text-sm text-dimmed grow">
              No discussion thread yet.
            </p>
            <BBHasPermission requiredPermissions={DISCUSSION_PERMISSION}>
              <BBButton
                disabled={startDiscussion.isPending}
                onClick={handleStartDiscussion}
              >
                Start discussion
              </BBButton>
            </BBHasPermission>
          </div>
        )}
        {startDiscussion.isError && (
          <p className="text-sm text-error">
            {startDiscussion.error?.message ??
              "Could not start the discussion."}
          </p>
        )}
        {threadId !== null &&
          threadId !== undefined &&
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
        {threadId !== null && threadId !== undefined && thread && (
          <>
            {(thread.messages ?? []).map((message) => (
              <BBPanel key={message.id ?? message.currentMessage?.messageId}>
                <p className="border-b-2 border-default px-2 py-1 text-xs text-dimmed">
                  {message.createdUser?.displayName ?? "Unknown"}
                  {message.createdTs && (
                    <>
                      {" — "}
                      <BBDate dateStr={message.createdTs} />
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
