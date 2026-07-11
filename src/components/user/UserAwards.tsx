import type { Award } from "../../types/user";

interface UserAwardsProps {
  awards?: Award[];
}

function awardIcon(iconName: string | null | undefined) {
  switch (iconName) {
    case "trophy":
      return <Fa6SolidTrophy />;
    case "star":
      return <Fa6SolidStar />;
    case "heart":
      return <Fa6SolidHeart />;
    default:
      return <Fa6SolidMedal />;
  }
}

export default function UserAwards({ awards }: UserAwardsProps) {
  if (!awards || awards.length === 0) {
    return null;
  }

  return (
    <BBFlex direction="col" align="center" className="gap-1.5">
      <BBMutedText className="text-xs uppercase tracking-wide">
        Awards
      </BBMutedText>
      <div className="flex flex-wrap justify-center gap-1.5">
        {awards.map((award) => (
          <span
            key={`${award.code}-${award.grantedTs ?? ""}`}
            title={award.reason ?? award.description ?? award.name}
            className="inline-flex items-center gap-1 rounded border border-default bg-accented px-2 py-0.5 text-xs"
          >
            {awardIcon(award.icon)}
            {award.name}
          </span>
        ))}
      </div>
    </BBFlex>
  );
}
