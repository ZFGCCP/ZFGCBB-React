import { Outlet } from "react-router";

export default function ProjectsLayout() {
  return (
    <article className="max-w-screen-xl mx-auto">
      <section className="w-full my-2">
        <Outlet />
      </section>
    </article>
  );
}
