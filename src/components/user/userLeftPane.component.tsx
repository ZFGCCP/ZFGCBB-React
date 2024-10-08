import React from "react";
import { User } from "../../types/user";
import { styled } from "@linaria/react";

const Style = {
  avatar: styled.img`
    width: 5rem;
    height: 5rem;
    border-radius: 50%;

    @media (min-width: 768px) {
      width: 10rem;
      height: 10rem;
      border: 0.2rem solid black;
      border-radius: 0;
    }
  `,
};

const UserLeftPane: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="left-pane p-2 col-12 col-md-3 d-flex flex-row-reverse flex-md-column align-items-center align-items-md-baseline">
      <h6>{user?.displayName}</h6>
      <div>{user.avatar && <Style.avatar src={user.avatar.url} />}</div>
      <div className="d-none d-md-block">
        <img src="http://localhost:8080/zfgbb/content/image/3" />
      </div>
    </div>
  );
};

export default UserLeftPane;
