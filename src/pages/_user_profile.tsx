import { type Crumb } from "@/components/common/BBBreadcrumb";

export default function UserProfile() {
  const { data: forumIndex } = useForumIndex();
  const siteName = forumIndex?.boardName ?? "Loading...";

  const breadcrumbs: Crumb[] = [
    { label: siteName, to: "/forum", prefetch: "render" },
    { label: "Profile" },
  ];

  return (
    <article>
      <section className="col-12 my-2">
        <BBBreadcrumb crumbs={breadcrumbs} />

        <div className="my-3">
          <BBWidget widgetTitle={"Profile Summary"}>
            <Outlet />
          </BBWidget>
        </div>

        <BBBreadcrumb crumbs={breadcrumbs} />
      </section>
    </article>
  );
}
