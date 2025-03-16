import type React from "react";
import { styled } from "@linaria/react";
import type { User } from "../../types/user";

const Style = {
  pane: styled.div`
    border-right: 0.2rem solid black;
  `,

  userNameHeader: styled.div`
    border-bottom: 1px solid black;
  `,

  avatar: styled.img`
    width: 5rem;
    height: 5rem;
    border-radius: 50%;

    @media (min-width: 992px) {
      width: 10rem;
      height: 10rem;
      border: 0.2rem solid black;
      border-radius: 0;
    }
  `,
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
