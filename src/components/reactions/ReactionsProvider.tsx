import { createContext, useContext, useMemo, type ReactNode } from "react";
import { type QueryKey } from "@tanstack/react-query";

import { reactionBatchUrl, useReactionBatch } from "@/hooks/data/useReactions";
import type {
  ContentReactionSummary,
  ReactableType,
} from "@/schemas/reactions";

type ReactionsContextValue = {
  reactableType: ReactableType;
  summaries: Map<number, ContentReactionSummary>;
  batchKey: QueryKey;
};

const ReactionsContext = createContext<ReactionsContextValue | null>(null);

export function useReactionsContext() {
  return useContext(ReactionsContext);
}

export default function ReactionsProvider({
  reactableType,
  reactableIds,
  children,
}: {
  reactableType: ReactableType;
  reactableIds: number[];
  children: ReactNode;
}) {
  const query = useReactionBatch(reactableType, reactableIds);
  const batchUrl = reactionBatchUrl(reactableType, reactableIds);
  const value = useMemo<ReactionsContextValue>(
    () => ({
      reactableType,
      summaries: new Map((query.data ?? []).map((s) => [s.reactableId, s])),
      batchKey: [batchUrl],
    }),
    [reactableType, batchUrl, query.data],
  );
  return (
    <ReactionsContext.Provider value={value}>
      {children}
    </ReactionsContext.Provider>
  );
}
