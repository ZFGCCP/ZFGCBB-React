import { useContext } from "react";

import { useToggleReaction } from "@/hooks/data/useReactions";
import { useReactionsContext } from "@/components/reactions/ReactionsProvider";
import { UserContext } from "@/providers/user/userProvider";
import type { ReactionTally } from "@/schemas/reactions";

interface ReactionBarProps {
  reactableId: number;
  className?: string;
}

function reactionIcon(iconName: string | null | undefined) {
  if (!iconName) return <Fa6SolidThumbsUp />;
  switch (iconName) {
    case "thumbs-up":
      return <Fa6SolidThumbsUp />;
    case "wrench":
      return <Fa6SolidWrench />;
    case "lightbulb":
      return <Fa6SolidLightbulb />;
    case "laugh":
      return <Fa6SolidFaceLaugh />;
    case "thumbs-down":
      return <Fa6SolidThumbsDown />;
    default:
      return <Fa6SolidHeart />;
  }
}

interface ReactionButtonProps {
  tally: ReactionTally;
  active: boolean;
  signedIn: boolean;
  pending: boolean;
  onToggle: (reactionTypeId: number) => void;
}

function ReactionButton({
  tally,
  active,
  signedIn,
  pending,
  onToggle,
}: ReactionButtonProps) {
  const handleClick = useCallback(() => {
    onToggle(tally.reactionTypeId);
  }, [onToggle, tally.reactionTypeId]);

  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={!signedIn || pending}
      title={signedIn ? tally.label : "Sign in to react"}
      onClick={handleClick}
      className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs transition-colors ${
        active
          ? "border-highlighted bg-accented font-semibold text-highlighted"
          : "border-default hover:bg-muted"
      } ${signedIn ? "cursor-pointer" : "cursor-not-allowed opacity-70"}`}
    >
      {reactionIcon(tally.icon)}
      {tally.count}
    </button>
  );
}

export default function ReactionBar({
  reactableId,
  className,
}: ReactionBarProps) {
  const currentUser = useContext(UserContext);
  const isSignedIn = (currentUser.id ?? 0) > 0;
  const reactions = useReactionsContext();
  const summary = reactions?.summaries.get(reactableId);
  const toggleReaction = useToggleReaction(
    reactions?.reactableType ?? "MESSAGE",
    reactableId,
    reactions?.batchKey,
  );
  const handleToggle = useCallback(
    (reactionTypeId: number) => {
      toggleReaction.mutate({ reactionTypeId });
    },
    [toggleReaction],
  );

  if (!summary) {
    return null;
  }

  const { tallies, userReactionTypeId, totalPoints } = summary;

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className ?? ""}`}>
      {tallies.map((tally) => {
        const isActiveChoice = tally.reactionTypeId === userReactionTypeId;
        return (
          <ReactionButton
            key={tally.reactionTypeId}
            tally={tally}
            active={isActiveChoice}
            signedIn={isSignedIn}
            pending={toggleReaction.isPending}
            onToggle={handleToggle}
          />
        );
      })}
      <span className="text-xs text-dimmed" title="Reputation points">
        {totalPoints} pts
      </span>
    </div>
  );
}
