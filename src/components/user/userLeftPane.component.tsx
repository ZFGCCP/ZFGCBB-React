import type React from "react";
import type { User } from "../../types/user";
import BBImage from "../common/bbImage.component";
import BBLink from "../common/bbLink.component";

const UserLeftPane: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="col-12 col-lg-2 border-r-2 border-black">
      <div className="p-2 border-b border-black h-[3.3125rem]">
        {user.id > 0 ? (
          <BBLink to={`/user/profile/${user.id}`}>{user?.displayName}</BBLink>
        ) : (
          <span>{user?.displayName}</span>
        )}
        <div className="text-sm">{user?.bioInfo?.customTitle}</div>
      </div>
      <div className="p-2 flex flex-row-reverse md:flex-col items-center">
        <div>
          {user.avatar && (
            <img
              src={user.avatar.url}
              className="w-20 h-20 rounded-full md:w-40 md:h-40 md:border md:border-black md:rounded-none"
              alt="User Avatar"
            />
          )}
        </div>
        <div className="hidden md:block">
          <BBImage
            src={`${import.meta.env.REACT_ZFGBB_API_URL}/image/3`}
            alt="FIXME: add proper alt text"
          />
        </div>
      </div>
    </div>
  );
};

export default UserLeftPane;
