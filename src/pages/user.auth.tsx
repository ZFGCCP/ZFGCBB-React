import { Outlet } from "react-router";

export default function UserAuth() {
  return (
    <div className="row">
      <div className="col-12 my-2">
        <Outlet />
      </div>
    </div>
  );
}
