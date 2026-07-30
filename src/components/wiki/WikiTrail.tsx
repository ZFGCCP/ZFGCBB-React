import type { TrailSegment } from "./WikiShell";

export default function WikiTrail({
  segments,
  right,
}: {
  segments: TrailSegment[];
  right?: React.ReactNode;
}) {
  const { data: config } = useWikiConfig();
  const root: TrailSegment = {
    label: (config?.siteName ?? "Wiki").toUpperCase(),
    to: "/wiki/Main_Page",
  };
  return (
    <p className="flex flex-wrap items-baseline gap-x-2 text-[10px] font-bold tracking-[0.25em] text-dimmed">
      {[root, ...segments].map((segment, index) => (
        <span key={segment.label} className="flex items-baseline gap-x-2">
          {index > 0 && <BBIcon name="nav" />}
          {segment.to ? (
            <BBLink to={segment.to} className="hover:text-highlighted">
              {segment.label}
            </BBLink>
          ) : (
            <span className="text-default">{segment.label}</span>
          )}
        </span>
      ))}
      {right}
    </p>
  );
}
