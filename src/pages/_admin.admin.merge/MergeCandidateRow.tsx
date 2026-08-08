import type * as v from "valibot";

export type MergeCandidate = v.InferOutput<typeof MergeCandidateSchema>;

export function candidateTargetLink(candidate: MergeCandidate) {
  if (candidate.targetType === "WIKI_PAGE" && candidate.targetSlug) {
    return `/wiki/${candidate.targetSlug}`;
  }
  if (candidate.targetType === "PROJECT" && candidate.targetSlug) {
    return `/content/projects/${candidate.targetSlug}`;
  }
  if (candidate.targetType === "THREAD") {
    return `/forum/thread/${candidate.targetId}/1`;
  }
  return null;
}

export function candidateKey(candidate: MergeCandidate) {
  return `${candidate.sourceType}:${candidate.sourceId}>${candidate.targetType}:${candidate.targetId}`;
}

export function MergeCandidateRow({
  candidate,
  pending,
  onApply,
  onDismiss,
}: {
  candidate: MergeCandidate;
  pending: boolean;
  onApply: (candidate: MergeCandidate) => void;
  onDismiss: (candidate: MergeCandidate) => void;
}) {
  const handleApply = useCallback(() => {
    onApply(candidate);
  }, [candidate, onApply]);
  const handleDismiss = useCallback(() => {
    onDismiss(candidate);
  }, [candidate, onDismiss]);
  const link = candidateTargetLink(candidate);

  return (
    <tr className="border-b border-muted align-top">
      <td className="py-1 pr-2">
        <span className="text-xs text-dimmed">{candidate.sourceType}</span>{" "}
        {candidate.sourceTitle}
      </td>
      <td className="py-1 pr-2">
        <span className="text-xs text-dimmed">{candidate.targetType}</span>{" "}
        {link ? (
          <BBLink to={link} className="text-highlighted">
            {candidate.targetTitle}
          </BBLink>
        ) : (
          candidate.targetTitle
        )}
      </td>
      <td className="py-1 pr-2">{candidate.confidence}%</td>
      <td className="py-1 pr-2 text-dimmed">{candidate.reason}</td>
      <td className="py-1 whitespace-nowrap">
        <BBButton size="xs" disabled={pending} onClick={handleApply}>
          Apply
        </BBButton>{" "}
        <BBButton size="xs" onClick={handleDismiss}>
          Dismiss
        </BBButton>
      </td>
    </tr>
  );
}
