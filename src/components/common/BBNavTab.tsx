import type { LinkProps } from "react-router";
import BBLink, { type RoutePaths } from "@/components/common/BBLink";

interface BBNavTabProps {
  title: string;
  count?: number;
  to?: RoutePaths | `${string}://${string}/${string}`;
  target?: string;
  prefetch?: LinkProps["prefetch"];
  active?: boolean;
  onClick?: () => void;
}

export default function BBNavTab({
  title,
  count,
  to,
  target,
  prefetch,
  active,
  onClick,
}: BBNavTabProps) {
  const shell = `flex px-4 mx-1 items-center gap-2 border-2 border-default border-b-0 h-8 rounded-t-lg ${
    active ? "bg-accented text-highlighted font-bold" : "bg-muted"
  }`;
  const badge = count != null && (
    <span className="text-xs text-dimmed">{count}</span>
  );

  if (to) {
    return (
      <div className={shell}>
        <BBLink
          to={to}
          relative="path"
          target={target}
          prefetch={prefetch}
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
