import { Outlet } from "react-router";

export const handle = {
  breadcrumb: { label: "Admin", to: "/admin" },
} satisfies BreadcrumbHandle;

export default function AdminLayout() {
  return (
    <article>
      <section className="col-12 my-2">
        <Outlet />
      </section>
    </article>
  );
}
