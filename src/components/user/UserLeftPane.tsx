import type { User } from "../../types/user";

interface UserLeftPaneProps {
  user?: User;
  backgrounds?: {
    avatarContainer?: ThemeBackgroundClass;
    profileInfoContainer?: ThemeBackgroundClass;
  };
}

export default function UserLeftPane({
  user,
  backgrounds = {
    profileInfoContainer: "bg-muted",
    avatarContainer: "bg-muted",
  },
}: UserLeftPaneProps) {
  return (
    <BBFlex
      align="stretch"
      direction="col"
      className={`${backgrounds.avatarContainer ?? ""} h-full w-full truncate`}
    >
      <BBFlex
        align="stretch"
        className={`min-h-16 p-3 ${backgrounds.profileInfoContainer ?? ""} border-b border-default shrink-0`}
      >
        <UserLeftPaneHeader user={user} />
      </BBFlex>
      <UserLeftPaneBody user={user} />
    </BBFlex>
  );
}
