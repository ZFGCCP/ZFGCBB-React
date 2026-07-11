import { useContext } from "react";

import { useToggleReaction } from "@/hooks/data/useReactions";
import { useReactionsContext } from "@/components/reactions/ReactionsProvider";
import { UserContext } from "@/providers/user/userProvider";

interface ReactionBarProps {
  reactableId: number;
  className?: string;
}

function reactionIcon(iconName: string | null | undefined) {
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

  if (!summary) {
    return null;
  }

  const { tallies, userReactionTypeId, totalPoints } = summary;

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className ?? ""}`}>
      {tallies.map((tally) => {
        const isActiveChoice = tally.reactionTypeId === userReactionTypeId;
        return (
          <button
            key={tally.reactionTypeId}
            type="button"
            aria-pressed={isActiveChoice}
            disabled={!isSignedIn || toggleReaction.isPending}
            title={isSignedIn ? tally.label : "Sign in to react"}
            onClick={() =>
              toggleReaction.mutate({ reactionTypeId: tally.reactionTypeId })
            }
            className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs transition-colors ${
              isActiveChoice
                ? "border-highlighted bg-accented font-semibold text-highlighted"
                : "border-default hover:bg-muted"
            } ${isSignedIn ? "cursor-pointer" : "cursor-not-allowed opacity-70"}`}
          >
            {reactionIcon(tally.icon)}
            {tally.count}
          </button>
        );
      })}
      <span className="text-xs text-dimmed" title="Reputation points">
        {totalPoints} pts
      </span>
    </div>
  );
}
