import React from "react";
import { User } from "../../types/user";
import { styled } from "@linaria/react";

const Style = {
  pane: styled.div`
    border-right: .2rem solid black;
  `,

  userNameHeader: styled.h6`
    width: 80%;
  `,

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
    <Style.pane className="left-pane p-2 col-12 col-lg-2 d-flex flex-row-reverse flex-md-column align-items-center">
      <Style.userNameHeader>{user?.displayName}</Style.userNameHeader>
      <div>{user.avatar && <Style.avatar src={user.avatar.url} />}</div>
      <div className="d-none d-md-block">
        <img src="http://localhost:8080/zfgbb/content/image/3" />
      </div>
    </Style.pane>
  );
};

export default UserLeftPane;
