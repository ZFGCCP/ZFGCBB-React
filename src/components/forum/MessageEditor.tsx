import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ContentEditorValue } from "@/components/common/forms/BBContentEditor";

interface MessageEditorProps {
  threadId: number;
  initialBody?: string;
}

export default function MessageEditor({
  threadId,
  initialBody,
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
          body: JSON.stringify({ body: values.body }),
        },
      );
      return handleResponseWithJason<unknown>(response);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        predicate: (query) =>
          typeof query.queryKey[0] === "string" &&
          query.queryKey[0].startsWith(`/thread/${threadId}`),
      });
    },
  });

  return (
    <div className="mt-3">
      <div className="p-4 mb-4 border-2 border-error text-error bg-accented">
        Warning: this topic has not been posted in for at least 14 days. Unless
        you're sure you want to reply, please consider starting a new topic.
      </div>

      <BBContentEditor
        initialBody={initialBody}
        submitLabel="Submit Post"
        pendingLabel="Posting..."
        errorMessage={newPostMutator.isError ? "Failed to post message." : null}
        onSubmit={(value) => newPostMutator.mutateAsync(value)}
      />
    </div>
  );
}
