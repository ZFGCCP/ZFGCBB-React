import { AdminRow } from "./AdminRow";

const ADMIN_PERMISSION = ["ZFGC_SITE_ADMIN"] as const;

export default function AdminDashboard() {
  return (
    <div className="space-y-4">
      <BBWidget widgetTitle="Forum">
        <AdminRow
          title="Boards"
          description="Create and configure categories and boards."
          to="/admin/boards"
          available={false}
        />
      </BBWidget>

      <BBWidget widgetTitle="Projects & Resources">
        <AdminRow
          title="Merge"
          description="Link imported projects and resources to wiki pages and threads, and merge duplicates."
          to="/admin/merge"
        />
      </BBWidget>

      <BBWidget widgetTitle="System">
        <AdminRow
          title="Users"
          description="View, edit and moderate accounts."
          to="/admin/users"
        />
        <AdminRow
          title="BBCodes"
          description="Enable or disable special bbcodes, like the [you] April Fools prank, and pick where each one works."
          to="/admin/bbcodes"
        />
        <AdminRow
          title="Site Settings"
          description="Default posting format."
          to="/admin/settings"
        />
        <BBHasPermission requiredPermissions={ADMIN_PERMISSION}>
          <AdminRow
            title="Backups"
            description="Create and download a full backup."
            to="/admin/backups"
          />
        </BBHasPermission>
        <AdminRow
          title="SMF Import"
          description="Import an existing SMF 2.0.x forum."
          to="/admin/migrate"
        />
      </BBWidget>
    </div>
  );
}
