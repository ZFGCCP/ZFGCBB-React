import BBFlex from "@/components/common/layout/bbFlex.component";
import Widget from "@/components/common/widgets/widget.component";
import BBLink from "@/components/common/bbLink.component";
import { Outlet, useLocation } from "react-router";

export default function UserProfile() {
  const route = useLocation();
  const { title, pathname, state } = route.state?.from ?? {};
  return (
    <article>
      <section className="col-12 my-2">
        <div className="mt-2">
          <BBFlex gap="gap-2">
            <BBLink to="/forum" prefetch="render">
              ZFGC.com
            </BBLink>
            {pathname && title ? (
              <>
                <span>&gt;&gt;</span>
                <BBLink to={pathname} state={route.state} prefetch="render">
                  {title}
                </BBLink>
              </>
            ) : null}
            <span>&gt;&gt;</span>
            <span>Profile</span>
          </BBFlex>
        </div>
        <Widget widgetTitle={"Profile Summary"}>
          <Outlet />
        </Widget>
      </section>
    </article>
  );
}
