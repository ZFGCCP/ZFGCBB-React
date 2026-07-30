export type TrailSegment = { label: string; to?: string };

function WikiSidebar() {
  const { data: config } = useWikiConfig();
  return (
    <aside
      aria-label="Wiki navigation"
      className="hidden w-40 shrink-0 self-start md:sticky md:top-4 md:block"
    >
      {(config?.nav ?? []).map((section) => (
        <nav key={section.title} aria-label={section.title} className="mb-4">
          <p className="mb-1.5 border-b border-dotted border-default pb-1 text-[10px] font-bold tracking-[0.25em] text-dimmed">
            {section.title.toUpperCase()}
          </p>
          <ul className="space-y-1 text-sm">
            {section.items.map((item) => (
              <li key={item.label}>
                <BBLink to={item.to} className="text-highlighted">
                  {item.label}
                </BBLink>
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </aside>
  );
}

export default function WikiShell({
  trail,
  children,
}: {
  trail?: TrailSegment[];
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-6xl gap-6 px-1">
      <WikiSidebar />
      <div className="min-w-0 grow">
        {trail && (
          <div className="mb-2">
            <WikiTrail segments={trail} />
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
