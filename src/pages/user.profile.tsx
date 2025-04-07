import Widget from "@/components/common/widgets/widget.component";
import { Outlet } from "react-router";

export default function UserProfile() {
  return (
    <article className="max-w-7xl mx-auto px-4">
      <section className="w-full my-4">
        <Widget widgetTitle={"Profile Summary"}>
          <Outlet />
        </Widget>
      </section>
    </article>
  );
}
