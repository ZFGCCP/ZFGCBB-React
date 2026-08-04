import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as v from "valibot";
import type { ContentEditorValue } from "@/components/common/forms/BBContentEditor";
import type { ContentFormat } from "@/types/content";

interface MessageEditorProps {
  threadId: number;
  initialBody?: string | undefined;
  initialContentFormat?: ContentFormat | undefined;
}

export default function MessageEditor({
  threadId,
  initialBody,
  initialContentFormat,
}: MessageEditorProps) {
  const queryClient = useQueryClient();
  const newPostMutator = useMutation<unknown, Error, ContentEditorValue>({
    mutationFn: async (values) => {
      const response = await apiFetch(
        `${getApiBaseUrl()}/message/${threadId}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            body: values.body,
            contentFormat: values.contentFormat,
          }),
        },
      );
      return handleResponseWithJason(response, v.unknown());
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        predicate: (query) =>
          typeof query.queryKey[0] === "string" &&
          query.queryKey[0].startsWith(`/thread/${threadId}`),
      });
    },
  });
  const handleSubmit = useCallback(
    (value: ContentEditorValue) => newPostMutator.mutateAsync(value),
    [newPostMutator],
  );

  return (
    <div className="mt-3">
      <div className="p-4 mb-4 border-2 border-error text-error bg-accented">
        Warning: this topic has not been posted in for at least 14 days. Unless
        you&apos;re sure you want to reply, please consider starting a new
        topic.
      </div>

      <BBContentEditor
        initialBody={initialBody}
        initialContentFormat={initialContentFormat}
        submitLabel="Submit Post"
        pendingLabel="Posting..."
        errorMessage={newPostMutator.isError ? "Failed to post message." : null}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
