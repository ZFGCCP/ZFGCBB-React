import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import type { CmsConfig, MergeCandidate } from "@/types/content";
import { CmsConfigFormSchema, type CmsConfigForm } from "@/schemas/system";
import { apiFetch } from "@/shared/http/apiFetch";
import { getApiBaseUrl } from "@/shared/http/api";
import { handleResponseWithJason } from "@/shared/http/response.handler";

function candidateTargetLink(candidate: MergeCandidate) {
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

function candidateKey(candidate: MergeCandidate) {
  return `${candidate.sourceType}:${candidate.sourceId}>${candidate.targetType}:${candidate.targetId}`;
}

function CmsSettings({ config }: { config: CmsConfig }) {
  const queryClient = useQueryClient();

  const configMutation = useMutation({
    mutationFn: async (discussionBoardId: string) => {
      const response = await apiFetch(`${getApiBaseUrl()}/system/cms/config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discussionBoardId }),
      });
      return handleResponseWithJason<CmsConfig>(response);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["/system/cms/config"] });
    },
  });

  const form = useForm({
    defaultValues: {
      discussionBoardId: config.discussionBoardId ?? "",
    } as CmsConfigForm,
    validators: {
      onBlur: CmsConfigFormSchema,
      onSubmit: CmsConfigFormSchema,
    },
    onSubmit: async ({ value }) => {
      await configMutation.mutateAsync(value.discussionBoardId);
    },
  });

  return (
    <BBWidget widgetTitle="CMS Settings">
      <BBForm
        form={form}
        className="p-4 space-y-3"
        errorMessage={
          configMutation.isError
            ? ((configMutation.error as Error)?.message ??
              "Failed to save settings.")
            : null
        }
      >
        <div className="flex items-end gap-3">
          <div className="w-40">
            <BBField
              label="Discussion board id"
              name="discussionBoardId"
              type="number"
            />
          </div>
          <BBSubmit
            pendingChildren="Saving..."
            className="px-4 py-2 bg-accented border border-default disabled:opacity-50"
          >
            Save
          </BBSubmit>
          <p className="text-xs text-dimmed grow">
            New project/resource discussions are created as threads in this
            board.
          </p>
        </div>
      </BBForm>
    </BBWidget>
  );
}

function MergeCenter() {
  const queryClient = useQueryClient();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const { data: candidates, isLoading } = useBBQuery<MergeCandidate[]>(
    "/system/cms/merge-candidates",
  );
  const { data: config } = useBBQuery<CmsConfig>("/system/cms/config");

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
        queryKey: ["/system/cms/merge-candidates"],
      });
    },
  });

  const visible = (candidates ?? []).filter(
    (candidate) => !dismissed.has(candidateKey(candidate)),
  );

  return (
    <div className="space-y-4">
      {config && <CmsSettings config={config} />}

      <BBWidget widgetTitle={`Merge Center (${visible.length} suggestions)`}>
        <div className="p-4">
          {isLoading && (
            <p className="text-dimmed text-sm">Computing candidates…</p>
          )}
          {!isLoading && visible.length === 0 && (
            <p className="text-dimmed text-sm">
              No merge suggestions — everything is linked up.
            </p>
          )}
          {visible.length > 0 && (
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
                {visible.map((candidate) => {
                  const link = candidateTargetLink(candidate);
                  return (
                    <tr
                      key={candidateKey(candidate)}
                      className="border-b border-muted align-top"
                    >
                      <td className="py-1 pr-2">
                        <span className="text-xs text-dimmed">
                          {candidate.sourceType}
                        </span>{" "}
                        {candidate.sourceTitle}
                      </td>
                      <td className="py-1 pr-2">
                        <span className="text-xs text-dimmed">
                          {candidate.targetType}
                        </span>{" "}
                        {link ? (
                          <BBLink to={link} className="text-highlighted">
                            {candidate.targetTitle}
                          </BBLink>
                        ) : (
                          candidate.targetTitle
                        )}
                      </td>
                      <td className="py-1 pr-2">{candidate.confidence}%</td>
                      <td className="py-1 pr-2 text-dimmed">
                        {candidate.reason}
                      </td>
                      <td className="py-1 whitespace-nowrap">
                        <BBButton
                          size="xs"
                          disabled={applyMutation.isPending}
                          onClick={() => applyMutation.mutate(candidate)}
                        >
                          Apply
                        </BBButton>{" "}
                        <BBButton
                          size="xs"
                          onClick={() =>
                            setDismissed(
                              new Set(dismissed).add(candidateKey(candidate)),
                            )
                          }
                        >
                          Dismiss
                        </BBButton>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {applyMutation.isError && (
            <p className="text-sm text-error mt-2">
              {(applyMutation.error as Error).message}
            </p>
          )}
        </div>
      </BBWidget>
    </div>
  );
}

export default function AdminMergePage() {
  return (
    <BBHasPermission requiredPermissions={["ZFGC_SITE_ADMIN"]}>
      <MergeCenter />
    </BBHasPermission>
  );
}
