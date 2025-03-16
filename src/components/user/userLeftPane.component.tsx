import type React from "react";
import { styled } from "@pigment-css/react";
import type { User } from "../../types/user";

const Style = {
  pane: styled("div")({
    borderRight: "0.2rem solid black",
  }),
  userNameHeader: styled("div")({
    borderBottom: "1px solid black",
    borderRight: "0.2rem solid black",
  }),
  avatar: styled("img")({
    width: "5rem",
    height: "5rem",
    borderRadius: "50%",
    "@media (min-width: 992px)": {
      width: "10rem",
      height: "10rem",
      border: "0.2rem solid black",
      borderRadius: "0",
    },
  }),
};

const UserLeftPane: React.FC<{ user: User }> = ({ user }) => {
  return (
    <Style.pane className="col-12 col-lg-2">
      <Style.userNameHeader>
        <div className="m-2 mt-0">{user?.displayName}</div>
      </Style.userNameHeader>
      <div className="p-2 d-flex flex-row-reverse flex-md-column align-items-center">
        <div>{user.avatar && <Style.avatar src={user.avatar.url} />}</div>
        <div className="d-none d-md-block">
          <img src="http://localhost:8080/zfgbb/content/image/3" />
        </div>
      </div>
    </Style.pane>
  );
};

export default UserLeftPane;
