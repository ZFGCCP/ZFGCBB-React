import { Outlet } from "react-router";

import { UserContext } from "@/providers/user/userProvider";

export const handle = {
  breadcrumb: { label: "Admin", to: "/admin" },
} satisfies BreadcrumbHandle;

const ADMIN_PERMISSION = "ZFGC_SITE_ADMIN";

export default function AdminLayout() {
  const { permissions } = useContext(UserContext);
  const isSiteAdmin = permissions?.some(
    (permission) => permission.permissionCode === ADMIN_PERMISSION,
  );

  if (!isSiteAdmin) return <BBForbidden />;

  return (
    <article>
      <section className="col-12 my-2">
        <Outlet />
      </section>
    </article>
  );
}
