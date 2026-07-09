import type { BBIconName } from "@/shared/bbIcon";

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
