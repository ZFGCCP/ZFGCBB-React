import type React from "react";
import { styled } from "styled-components";
import type { User } from "../../types/user";
import BBImage from "../common/bbImage.component";
import BBLink from "../common/bbLink.component";

const Style = {
  pane: styled.div`
    border-right: 0.2rem solid black;
  `,

  userNameHeader: styled.div`
    border-bottom: 1px solid black;
    height: 3.3125rem;
  `,

  avatar: styled.img`
    width: 5rem;
    height: 5rem;
    border-radius: 50%;

    @media (min-width: 992px) {
      max-width: 10rem;
      max-height: 10rem;
      border: 0.2rem solid black;
      border-radius: 0;
    }
  `,

  customTitle: styled.div`
    font-size: 0.8rem;
  `,
};

const UserLeftPane: React.FC<{ user: User }> = ({ user }) => {
  return (
    <Style.pane className="col-12 col-lg-2">
      <Style.userNameHeader className="p-2">
        {user.id > 0 ? (
          <BBLink to={`/user/profile/${user.id}`}>{user?.displayName}</BBLink>
        ) : (
          <span>{user?.displayName}</span>
        )}
        <Style.customTitle>{user?.bioInfo?.customTitle}</Style.customTitle>
      </Style.userNameHeader>
      <div className="p-2 d-flex flex-row-reverse flex-md-column align-items-center">
        <div>{user.bioInfo && user.bioInfo.avatar && <Style.avatar src={user.bioInfo.avatar.location} />}</div>
        <div className="d-none d-md-block">
          <BBImage
            src={`${import.meta.env.REACT_ZFGBB_API_URL}/image/3`}
            alt="FIXME: add proper alt text"
          />
        </div>
      </div>
    </Style.pane>
  );
};

export default UserLeftPane;
