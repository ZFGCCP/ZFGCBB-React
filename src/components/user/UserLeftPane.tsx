import type { User } from "@/types/user";
import type { ThemeBackgroundClassValue } from "@/components/common/BBThemePicker";

interface UserLeftPaneProps {
  user?: User | undefined;
  extraDetailsSlot?: React.ReactNode;
  backgrounds?:
    | {
        avatarContainer?: ThemeBackgroundClassValue | undefined;
        profileInfoContainer?: ThemeBackgroundClassValue | undefined;
      }
    | undefined;
}

const DEFAULT_BACKGROUNDS: NonNullable<UserLeftPaneProps["backgrounds"]> = {
  profileInfoContainer: "bg-muted",
  avatarContainer: "bg-muted",
};

export default function UserLeftPane({
  user,
  extraDetailsSlot,
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
        <UserLeftPaneHeader user={user ?? undefined} />
      </BBFlex>
      <UserLeftPaneBody
        user={user ?? undefined}
        extraDetailsSlot={extraDetailsSlot}
      />
    </BBFlex>
  );
}
