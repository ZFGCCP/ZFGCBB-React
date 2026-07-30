import type { User } from "@/types/user";
import type { ThemeBackgroundClassValue } from "@/components/common/BBThemePicker";

interface UserLeftPaneProps {
  user?: User;
  backgrounds?: {
    avatarContainer?: ThemeBackgroundClassValue;
    profileInfoContainer?: ThemeBackgroundClassValue;
  };
}

const DEFAULT_BACKGROUNDS: NonNullable<UserLeftPaneProps["backgrounds"]> = {
  profileInfoContainer: "bg-muted",
  avatarContainer: "bg-muted",
};

export default function UserLeftPane({
  user,
  backgrounds = DEFAULT_BACKGROUNDS,
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
