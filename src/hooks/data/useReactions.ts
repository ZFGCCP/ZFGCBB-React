import { useQueryClient, type QueryKey } from "@tanstack/react-query";

import type {
  ContentReactionSummary,
  ReactableType,
} from "@/schemas/reactions";

export function reactionBatchUrl(
  reactableType: ReactableType,
  reactableIds: number[],
): `/${string}` {
  const ids = reactableIds.toSorted((a, b) => a - b).join(",");
  return `/reactions/summaries?reactableType=${reactableType}&reactableIds=${ids}`;
}

export function reactionBatchQueryOptions(
  reactableType: ReactableType,
  reactableIds: number[],
  requestHeaders?: Record<string, string>,
) {
  return bbQueryOptions(
    reactionBatchUrl(reactableType, reactableIds),
    { schema: ContentReactionSummaryListSchema, meta: { userScoped: true } },
    requestHeaders,
  );
}

export function useReactionTypes() {
  return useBBQuery("/reactions/types", { schema: ReactionTypeListSchema });
}

export function useReactionBatch(
  reactableType: ReactableType,
  reactableIds: number[],
) {
  return useBBQuery(reactionBatchUrl(reactableType, reactableIds), {
    schema: ContentReactionSummaryListSchema,
    enabled: reactableIds.length > 0,
    meta: { userScoped: true },
  });
}

export function useToggleReaction(
  reactableType: ReactableType,
  reactableId: number,
  batchKey?: QueryKey,
) {
  const queryClient = useQueryClient();
  return useBBMutation({
    schema: ContentReactionSummarySchema,
    request: (variables: { reactionTypeId: number }) => ({
      url: "/reactions",
      method: "POST",
      body: {
        reactableType,
        reactableId,
        reactionTypeId: variables.reactionTypeId,
      },
    }),
    onSuccess: async (data) => {
      if (!batchKey) return;
      await queryClient.cancelQueries({ queryKey: batchKey });
      queryClient.setQueryData<ContentReactionSummary[]>(batchKey, (old) =>
        old
          ? old.map((entry) =>
              entry.reactableId === data.reactableId ? data : entry,
            )
          : old,
      );
    },
  });
}
