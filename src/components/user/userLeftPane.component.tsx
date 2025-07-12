import type React from "react";
import { useMemo } from "react";
import type { User } from "../../types/user";
import BBImage from "../common/bbImage.component";
import BBLink from "../common/bbLink.component";

interface UserLeftPaneProps {
  user: User;
}

const UserLeftPane: React.FC<UserLeftPaneProps> = ({ user }) => {
  const avatarSrc = useMemo(() => {
    if (user.bioInfo?.avatar) {
      return user.bioInfo?.avatar?.url && user.bioInfo?.avatar?.url?.trim()
        ? user.bioInfo.avatar.url
        : (`${import.meta.env.REACT_ZFGBB_API_URL}/content/image/${user.bioInfo.avatar.contentResourceId}` as `${string}://${string}/${string}`);
    }

    return `${import.meta.env.REACT_ZFGBB_API_URL}/content/image/3` as `${string}://${string}/${string}`;
  }, [user]);

  return (
    <div className="grid grid-rows-[auto_auto_1fr] bg-muted h-full">
      <div className="p-3 bg-elevated border-b border-default">
        <div className="space-y-1">
          {user.id > 0 ? (
            <BBLink to={`/user/profile/${user.id}`} className="font-medium">
              {user?.displayName}
            </BBLink>
          ) : (
            <span className="font-medium">{user?.displayName}</span>
          )}
          {user?.bioInfo?.customTitle && (
            <div className="text-sm text-muted">
              {user?.bioInfo?.customTitle}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 flex justify-center">
        <BBImage
          src={avatarSrc}
          alt="User avatar"
          className="w-24 h-24 rounded border border-default"
        />
      </div>

      <div className="p-3 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted">Posts:</span>
          <span></span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Joined:</span>
          <span></span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Status:</span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default UserLeftPane;
