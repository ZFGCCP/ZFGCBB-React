import type { User } from "../../types/user";

export default function UserLeftPaneHeader({
  user,
}: {
  user?: User | undefined;
}) {
  return (
    <BBFlex
      direction="col"
      className="space-y-0.5 leading-tight font-medium truncate max-w-40"
    >
      {user && Number(user.id) > 0 ? (
        <BBLink
          to={`/user/profile/${user.id}`}
          className="font-medium truncate w-full"
        >
          {user?.displayName}
        </BBLink>
      ) : (
        <span className="font-medium">{user?.displayName}</span>
      )}
      {user?.bioInfo?.customTitle && (
        <BBMutedText className="truncate w-full text-xs">
          {user?.bioInfo?.customTitle}
        </BBMutedText>
      )}
    </BBFlex>
  );
}
