import { AdminCard } from "./AdminCard";

const ADMIN_PERMISSION = ["ZFGC_SITE_ADMIN"] as const;

export default function AdminDashboard() {
  return (
    <div className="space-y-4">
      <BBWidget widgetTitle="Admin Dashboard">
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <AdminCard
            title="Migration"
            description="Import data from an existing SMF 2.0.x forum installation."
            to="/system/migrate"
          />
          <AdminCard
            title="CMS Merge Center"
            description="Link projects and resources to wiki articles and forum threads, and merge duplicates."
            to="/admin/merge"
          />
          <AdminCard
            title="User Management"
            description="View, edit, and moderate user accounts."
            to="/admin/users"
          />
          <AdminCard
            title="BBCode Management"
            description="Enable or disable special bbcodes, like the [you] April Fools prank."
            to="/admin/bbcodes"
          />
          <AdminCard
            title="Wiki Import Namespaces"
            description="Map source MediaWiki namespace ids to the names they take in this wiki."
            to="/admin/wiki-namespaces"
          />
          <BBHasPermission requiredPermissions={ADMIN_PERMISSION}>
            <AdminCard
              title="Backups"
              description="Create and download a one-time full application backup."
              to="/admin/backups"
            />
          </BBHasPermission>
          <AdminCard
            title="Board Management"
            description="Create and configure forum categories and boards."
            to="/admin/boards"
            available={false}
          />
        </div>
      </BBWidget>
    </div>
  );
}
