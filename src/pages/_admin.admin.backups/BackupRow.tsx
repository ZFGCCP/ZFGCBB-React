import type * as v from "valibot";

export type AdminBackup = v.InferOutput<typeof AdminBackupSchema>;

export function formatBytes(bytes?: number) {
  if (bytes === undefined) return "—";
  return `${(bytes / (1024 * 1024)).toFixed(2)} MiB`;
}

export function BackupRow({
  backup,
  preparing,
  onDownload,
}: {
  backup: AdminBackup;
  preparing: boolean;
  onDownload: (backup: AdminBackup) => void;
}) {
  const handleDownload = useCallback(() => {
    onDownload(backup);
  }, [backup, onDownload]);

  return (
    <div className="border border-default p-3 flex flex-wrap items-center gap-3 text-sm">
      <code>{backup.id}</code>
      <strong>{backup.state}</strong>
      <span>{formatBytes(backup.archiveBytes)}</span>
      <span>
        Created <BBDate dateStr={backup.createdAt} />
      </span>
      <span>
        Expires <BBDate dateStr={backup.expiresAt} />
      </span>
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
