import { BackupManagement } from "./BackupManagement";

export const handle = {
  breadcrumb: "Backups",
} satisfies BreadcrumbHandle;

const ADMIN_PERMISSION = ["ZFGC_SITE_ADMIN"] as const;

export default function AdminBackupsPage() {
  return (
    <BBHasPermission requiredPermissions={ADMIN_PERMISSION}>
      <BackupManagement />
    </BBHasPermission>
  );
}
