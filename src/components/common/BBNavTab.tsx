import type { LinkProps } from "react-router";
import { type RoutePaths } from "@/components/common/BBLink";

interface BBNavTabProps {
  title: string;
  count?: number | undefined;
  to?: RoutePaths | `${string}://${string}/${string}` | undefined;
  target?: string | undefined;
  prefetch?: LinkProps["prefetch"] | undefined;
  active?: boolean | undefined;
  raiseOnHover?: boolean | undefined;
  onClick?: (() => void) | undefined;
}

export default function BBNavTab({
  title,
  count,
  to,
  target,
  prefetch,
  active,
  raiseOnHover = false,
  onClick,
}: BBNavTabProps) {
  const inactive = raiseOnHover
    ? "bg-muted mt-0.5 hover:h-8.5 hover:mt-0"
    : "bg-muted";
  const shell = `relative flex px-4 mx-1 items-center gap-2 border-2 border-default border-b-0 h-8 rounded-t-lg transition-colors duration-300 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:border-b-2 after:border-inverted after:bg-elevated after:transition-transform after:duration-300 after:content-[''] ${
    active ? "z-10 bg-elevated text-highlighted after:scale-x-100" : inactive
  }`;
  const badge = count !== null && count !== undefined && (
    <span className="text-xs text-dimmed">{count}</span>
  );

  if (to) {
    return (
      <div className={shell}>
        <BBLink
          to={to}
          relative="path"
          {...(target ? { target } : {})}
          {...(prefetch ? { prefetch } : {})}
          className="flex items-center gap-2 hover:text-highlighted"
        >
          {title}
          {badge}
        </BBLink>
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${shell} cursor-pointer hover:text-highlighted`}
    >
      {title}
      {badge}
    </button>
  );
}
