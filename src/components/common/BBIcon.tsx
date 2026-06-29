import type { BBIconName, RankBadgeName } from "@/shared/bbIcon";

export function BBIcon({
  name,
  className,
}: {
  name: BBIconName;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`spr spr-${name}${className ? ` ${className}` : ""}`}
    />
  );
}

export function BBRankBadge({
  name,
  className,
}: {
  name: RankBadgeName;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`badge badge-${name}${className ? ` ${className}` : ""}`}
    />
  );
}
