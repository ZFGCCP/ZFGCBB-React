import { useQueryClient } from "@tanstack/react-query";
import { refreshExpectedSession } from "@/providers/query/queryProvider";

const ADMIN_PERMISSION = ["ZFGC_SITE_ADMIN"] as const;

function formatBytes(bytes?: number) {
  if (bytes === undefined) return "—";
  return `${(bytes / (1024 * 1024)).toFixed(2)} MiB`;
}

async function preflightBackup(id: string) {
  const response = await apiFetch(
    `${getApiBaseUrl()}/admin/backups/${encodeURIComponent(id)}`,
  );
  return handleResponseWithJason(response, AdminBackupSchema);
}

function BackupRow({
  backup,
  preparing,
  onDownload,
}: {
  backup: AdminBackup;
  preparing: boolean;
  onDownload: (backup: AdminBackup) => void;
}) {
  const handleDownload = useCallback(
    () => onDownload(backup),
    [backup, onDownload],
  );

  return (
    <div className="border border-default p-3 flex flex-wrap items-center gap-3 text-sm">
      <code>{backup.id}</code>
      <strong>{backup.state}</strong>
      <span>{formatBytes(backup.archiveBytes)}</span>
      <span>Created {new Date(backup.createdAt).toLocaleString()}</span>
      <span>Expires {new Date(backup.expiresAt).toLocaleString()}</span>
      {backup.installerCompatible && <span>Installer-compatible</span>}
      {backup.downloadReady && (
        <BBButton size="xs" disabled={preparing} onClick={handleDownload}>
          {preparing ? "Preparing..." : "Download once"}
        </BBButton>
      )}
      {backup.error && <span className="text-error">{backup.error}</span>}
    </div>
  );
}

function BackupManagement() {
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
  const handleCreate = useCallback(() => createBackup.mutate(), [createBackup]);
  const handleDownload = useCallback(
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

  return (
    <BBWidget widgetTitle="Backups">
      <div className="p-4 space-y-4">
        <div className="border-2 border-highlighted p-3 space-y-2">
          <p className="font-bold">Sensitive full-application backup</p>
          <p className="text-sm">
            Archives include private messages, authentication state,
            configuration, and private content. They are not encrypted.
            Browsers, proxies, snapshots, and copy-on-write storage may retain
            downloaded bytes.
          </p>
        </div>
        <p className="text-sm text-dimmed">
          Each completed archive can be downloaded once before it expires. The
          browser prepares an authenticated download window, then streams the
          archive directly instead of buffering it in this page.
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

export default function AdminBackupsPage() {
  return (
    <BBHasPermission requiredPermissions={ADMIN_PERMISSION}>
      <BackupManagement />
    </BBHasPermission>
  );
}
