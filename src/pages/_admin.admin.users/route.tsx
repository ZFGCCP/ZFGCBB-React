import { UserManagement } from "./UserManagement";

export const handle = {
  breadcrumb: "Users",
} satisfies BreadcrumbHandle;

const ADMIN_PERMISSION = ["ZFGC_SITE_ADMIN"] as const;

export default function AdminUsersPage() {
  return (
    <BBHasPermission requiredPermissions={ADMIN_PERMISSION}>
      <UserManagement />
    </BBHasPermission>
  );
}
