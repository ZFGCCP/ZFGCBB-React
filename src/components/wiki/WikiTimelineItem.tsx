export default function WikiTimelineItem({
  summary,
  children,
}: {
  summary?: string | null;
  children: React.ReactNode;
}) {
  return (
    <li className="relative py-2 before:absolute before:-left-5.25 before:top-4 before:h-2 before:w-2 before:rounded-full before:border before:border-default before:bg-elevated">
      <div className="flex flex-wrap items-baseline gap-x-2 text-sm">
        {children}
      </div>
      {summary && <p className="text-xs italic text-dimmed">({summary})</p>}
    </li>
  );
}
