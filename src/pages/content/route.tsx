export default function ContentLayout() {
  return (
    <article>
      <section className="col-12 my-2">
        <Outlet />
      </section>
    </article>
  );
}
