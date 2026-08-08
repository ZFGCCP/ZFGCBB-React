export interface AdminRowProps {
  title: string;
  description: string;
  to: string;
  available?: boolean;
}

export function AdminRow({
  title,
  description,
  to,
  available = true,
}: AdminRowProps) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 p-2 border-b border-default last:border-b-0">
      {available ? (
        <BBLink to={to} className="w-36 shrink-0 font-bold text-highlighted">
          {title}
        </BBLink>
      ) : (
        <span className="w-36 shrink-0 font-bold text-dimmed">{title}</span>
      )}
      <span className="text-sm text-dimmed">
        {description}
        {!available && " (soon)"}
      </span>
    </div>
  );
}
