import { Outlet } from "react-router";

export const handle = { breadcrumb: "Account Settings" };

export default function UserSettingsLayout() {
  return (
    <article>
      <section className="col-12 my-2">
        <Outlet />
      </section>
    </article>
  );
}
