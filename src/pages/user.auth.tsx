import { Outlet } from "react-router";

export default function UserAuthLayout() {
  return (
    <article>
      <section className="col-12 my-2">
        <Outlet />
      </section>
    </article>
  );
}
