import type { User } from "../../types/user";
import UserAwards from "./UserAwards";

function AvatarSkeleton() {
  return <BBSkeleton className="h-24 w-24 rounded border border-default " />;
}

const AVATAR_SKELETON = <AvatarSkeleton />;

export default function UserLeftPaneBody({
  user,
  extraDetailsSlot,
}: {
  user?: User | undefined;
  extraDetailsSlot?: React.ReactNode;
}) {
  const avatarSrc = useMemo(() => {
    if (user?.bioInfo?.avatar) {
      const { contentResourceId, url } = user.bioInfo.avatar;
      if (url?.trim()) return url;
      if (contentResourceId !== null && contentResourceId !== undefined)
        return contentUrl(contentResourceId);
    }

    return contentUrl(3);
  }, [user]);

  const reactionSummary = user?.reactionSummary;
  const reputation = reactionSummary?.reputationPoints ?? 0;

  return (
    <>
      <BBFlex
        direction="col"
        align="center"
        justify="center"
        className="p-4  text-center"
      >
        {user && (
          <BBImage
            dynamicSrc={avatarSrc}
            alt="User avatar"
            className="w-24 h-24 rounded border border-default object-cover"
            fallback={AVATAR_SKELETON}
          />
        )}

        {!user && <AvatarSkeleton />}

        {user && (
          <div className="mt-2">
            <BBRankBadge name={rankBadgeFor(user)} />
          </div>
        )}

        <BBMutedText className="truncate w-64 overflow-hidden text-sm">
          {user?.bioInfo?.personalText}
        </BBMutedText>
        <div className="text-xs">
          {reputation} rep (
          <span className="text-success">
            +{reactionSummary?.positiveCount ?? 0}
          </span>
          /
          <span className="text-error">
            -{reactionSummary?.negativeCount ?? 0}
          </span>
          )
        </div>
        <UserAwards awards={user?.awards} />
      </BBFlex>

      <BBFlex direction="col" align="stretch" className="p-3 space-y-2 text-sm">
        <BBMutedText>Posts: {user?.bioInfo?.postCount}</BBMutedText>
        <BBMutedText>
          Joined: <BBDate dateStr={user?.bioInfo?.dateRegistered} />
        </BBMutedText>
        <BBMutedText>Status:</BBMutedText>
        {extraDetailsSlot}
      </BBFlex>
    </>
  );
}
