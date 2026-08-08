import type { RankBadgeName } from "@/shared/bbIcon";

export default function BBRankBadge({
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
