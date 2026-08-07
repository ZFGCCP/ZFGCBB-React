import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CmsSettings } from "./CmsSettings";
import {
  type MergeCandidate,
  MergeCandidateRow,
  candidateKey,
} from "./MergeCandidateRow";

const MERGE_EMPTY_STATE = <BBEmpty message="No merge candidates" />;
const isMergeListEmpty = (list: MergeCandidate[]) => list.length === 0;

export function MergeCenter() {
  const queryClient = useQueryClient();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const candidatesQuery = useBBQuery("/admin/cms/merge-candidates", {
    schema: MergeCandidateListSchema,
  });
  const { data: config } = useBBQuery("/admin/cms/config", {
    schema: CmsConfigSchema,
  });

  const applyMutation = useMutation({
    mutationFn: async (candidate: MergeCandidate) => {
      const response = await apiFetch(`${getApiBaseUrl()}/system/cms/merge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceType: candidate.sourceType,
          sourceId: candidate.sourceId,
          targetType: candidate.targetType,
          targetId: candidate.targetId,
        }),
      });
      if (!response.ok) throw new Error(`Merge failed (${response.status})`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["/admin/cms/merge-candidates"],
      });
    },
  });

  const visible = useMemo(
    () =>
      (candidatesQuery.data ?? []).filter(
        (candidate) => !dismissed.has(candidateKey(candidate)),
      ),
    [candidatesQuery.data, dismissed],
  );
  const handleApply = useCallback(
    (candidate: MergeCandidate) => {
      applyMutation.mutate(candidate);
    },
    [applyMutation],
  );
  const handleDismiss = useCallback((candidate: MergeCandidate) => {
    setDismissed((current) => new Set([...current, candidateKey(candidate)]));
  }, []);
  const renderCandidates = useCallback(
    () =>
      visible.length === 0 ? (
        <p className="text-dimmed text-sm">
          No merge suggestions — everything is linked up.
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b-2 border-default">
              <th className="py-1 pr-2">Source</th>
              <th className="py-1 pr-2">Suggestion</th>
              <th className="py-1 pr-2">Confidence</th>
              <th className="py-1 pr-2">Reason</th>
              <th className="py-1">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((candidate) => (
              <MergeCandidateRow
                key={candidateKey(candidate)}
                candidate={candidate}
                pending={applyMutation.isPending}
                onApply={handleApply}
                onDismiss={handleDismiss}
              />
            ))}
          </tbody>
        </table>
      ),
    [applyMutation.isPending, handleApply, handleDismiss, visible],
  );

  return (
    <div className="space-y-4">
      {config && <CmsSettings config={config} />}

      <BBWidget widgetTitle={`Merge (${visible.length} suggestions)`}>
        <div className="p-4">
          <BBQueryBoundary
            query={candidatesQuery}
            isEmpty={isMergeListEmpty}
            empty={MERGE_EMPTY_STATE}
          >
            {renderCandidates}
          </BBQueryBoundary>
          {applyMutation.isError && (
            <p className="text-sm text-error mt-2">
              {applyMutation.error.message}
            </p>
          )}
        </div>
      </BBWidget>
    </div>
  );
}
