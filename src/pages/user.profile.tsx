import Widget from "@/components/common/widgets/widget.component";
import { Outlet } from "react-router";

export default function UserProfile() {
  return (
    <div className="row">
      <div className="col-12 my-2">
        <Widget widgetTitle={"Profile Summary"}>
          <Outlet />
        </Widget>
      </div>
    </div>
  );
}
