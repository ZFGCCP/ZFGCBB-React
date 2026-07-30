import { MergeCenter } from "./MergeCenter";

export const handle = {
  breadcrumb: "CMS Merge Center",
} satisfies BreadcrumbHandle;

const ADMIN_PERMISSION = ["ZFGC_SITE_ADMIN"] as const;

export default function AdminMergePage() {
  return (
    <BBHasPermission requiredPermissions={ADMIN_PERMISSION}>
      <MergeCenter />
    </BBHasPermission>
  );
}
