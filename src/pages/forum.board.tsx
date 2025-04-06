import { Outlet, useNavigation } from "react-router";

export default function ForumBoard() {
  const navigation = useNavigation();
  return (
    <>
      <div className="row">
        <div className="col-12 my-2">
          {navigation.state === "loading" ? (
            <div>
              <p>Loading...</p>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </>
  );
}
