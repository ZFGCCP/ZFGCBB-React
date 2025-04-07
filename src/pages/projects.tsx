import { Outlet } from "react-router";

export default function ProjectsLayout() {
  return (
    <article className="container-xxl">
      <section className="col-12 my-2">
        <Outlet />
      </section>
    </article>
  );
}
