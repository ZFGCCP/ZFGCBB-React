import type { RailItem } from "./showcaseTypes";

export default function HighlightRail({
  title,
  glyph,
  items,
}: {
  title: string;
  glyph: React.ReactNode;
  items: RailItem[];
}) {
  return (
    <section aria-label={title} className="flex min-w-0 flex-col">
      <SectionBar title={title} glyph={glyph} />
      <BBPanel as="ul" className="grow divide-y divide-default/40">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              to={item.href}
              className="flex items-center gap-2.5 px-2.5 py-2 transition-colors hover:bg-elevated"
            >
              <Thumb
                previewId={item.previewId}
                title={item.title}
                className="h-9 w-9 shrink-0 border border-default"
              />
              <span className="min-w-0">
                <span className="block truncate text-sm leading-tight text-highlighted">
                  {item.title}
                </span>
                <span className="block truncate text-[11px] text-dimmed">
                  {item.subtitle}
                </span>
              </span>
            </Link>
          </li>
        ))}
        {items.length === 0 && (
          <li className="px-2.5 py-4 text-center text-xs text-dimmed">
            Nothing here yet.
          </li>
        )}
      </BBPanel>
    </section>
  );
}
