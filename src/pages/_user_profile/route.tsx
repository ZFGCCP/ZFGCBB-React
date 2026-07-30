export const handle = { breadcrumb: "Profile" };

export default function UserProfile() {
  return (
    <article>
      <section className="col-12 my-2">
        <div className="my-3">
          <BBWidget widgetTitle={"Profile Summary"} className="shadow-panel">
            <Outlet />
          </BBWidget>
        </div>
      </section>
    </article>
  );
}
