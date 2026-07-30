import { WikiNamespaceManagement } from "./WikiNamespaceManagement";

export const handle = {
  breadcrumb: "Wiki Import Namespaces",
} satisfies BreadcrumbHandle;

const ADMIN_PERMISSION = ["ZFGC_SITE_ADMIN"] as const;

export default function AdminWikiNamespacesPage() {
  return (
    <BBHasPermission requiredPermissions={ADMIN_PERMISSION}>
      <WikiNamespaceManagement />
    </BBHasPermission>
  );
}
