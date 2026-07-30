import { BbCodeManagement } from "./BbCodeManagement";

export const handle = {
  breadcrumb: "BBCode Management",
} satisfies BreadcrumbHandle;

const ADMIN_PERMISSION = ["ZFGC_SITE_ADMIN"] as const;

export default function AdminBbCodesPage() {
  return (
    <BBHasPermission requiredPermissions={ADMIN_PERMISSION}>
      <BbCodeManagement />
    </BBHasPermission>
  );
}
