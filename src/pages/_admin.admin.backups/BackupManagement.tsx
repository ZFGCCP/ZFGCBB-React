import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { refreshExpectedSession } from "@/providers/query/queryProvider";
import { type AdminBackup, BackupRow } from "./BackupRow";

async function preflightBackup(id: string) {
  const response = await apiFetch(
    `${getApiBaseUrl()}/admin/backups/${encodeURIComponent(id)}`,
  );
  return handleResponseWithJason(response, AdminBackupSchema);
}

export function BackupManagement() {
  const queryClient = useQueryClient();
  const [preparingId, setPreparingId] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const backups = useBBQuery("/admin/backups", {
    schema: AdminBackupListSchema,
    queryKey: "admin-backups",
    refetchInterval: 2000,
    staleTime: 0,
  });
  const createBackup = useBBMutation({
    request: () => ({ url: "/admin/backups" }),
    schema: AdminBackupSchema,
    invalidateKeys: [["admin-backups"]],
  });
  const handleCreate = useCallback(() => {
    createBackup.mutate();
  }, [createBackup]);
  const downloadBackup = useCallback(
    async (backup: AdminBackup) => {
      setDownloadError(null);
      const popup = window.open("about:blank", "_blank");
      if (!popup) {
        setDownloadError(
          "The browser blocked the download window. Allow pop-ups for this site and try again.",
        );
        return;
      }
      popup.opener = null;
      setPreparingId(backup.id);
      try {
        let current: AdminBackup;
        try {
          current = await preflightBackup(backup.id);
        } catch (error) {
          if (
            getResponseStatus(error) !== 401 ||
            !(await refreshExpectedSession())
          ) {
            throw error;
          }
          current = await preflightBackup(backup.id);
        }
        if (!current.downloadReady) {
          throw new Error("Backup is no longer ready for download.");
        }
        popup.location.replace(
          `${getApiBaseUrl()}/admin/backups/${encodeURIComponent(current.id)}/download`,
        );
        void queryClient.invalidateQueries({ queryKey: ["admin-backups"] });
      } catch {
        popup.close();
        setDownloadError(
          "The backup could not be prepared for download. Refresh the list and try again.",
        );
      } finally {
        setPreparingId(null);
      }
    },
    [queryClient],
  );
  const handleDownload = useCallback(
    (backup: AdminBackup) => {
      void downloadBackup(backup);
    },
    [downloadBackup],
  );

  return (
    <BBWidget widgetTitle="Backups">
      <div className="p-4 space-y-4">
        <div className="border-2 border-highlighted p-3 space-y-2">
          <p className="font-bold">Sensitive full-application backup</p>
          <p className="text-sm">
            Archives hold everything, private messages and credentials included,
            and are not encrypted. Guard the downloaded file.
          </p>
        </div>
        <p className="text-sm text-dimmed">
          Each archive can be downloaded once before it expires.
        </p>
        <BBButton disabled={createBackup.isPending} onClick={handleCreate}>
          {createBackup.isPending ? "Starting..." : "Create backup"}
        </BBButton>
        {createBackup.isError && (
          <p className="text-error">{createBackup.error.message}</p>
        )}
        {backups.isError && (
          <p className="text-error">{backups.error.message}</p>
        )}
        {downloadError && <p className="text-error">{downloadError}</p>}
        <div className="space-y-2">
          {(backups.data ?? []).map((backup) => (
            <BackupRow
              key={backup.id}
              backup={backup}
              preparing={preparingId === backup.id}
              onDownload={handleDownload}
            />
          ))}
          {backups.isSuccess && backups.data.length === 0 && (
            <p className="text-sm text-dimmed">No backups have been created.</p>
          )}
        </div>
      </div>
    </BBWidget>
  );
}
