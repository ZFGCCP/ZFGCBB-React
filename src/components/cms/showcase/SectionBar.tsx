export default function SectionBar({
  title,
  hint,
  glyph,
  right,
}: {
  title: string;
  hint?: string;
  glyph?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 border-2 border-b-0 border-default bg-accented px-3 py-1.5">
      {glyph ? (
        <span
          aria-hidden
          className="flex h-5 w-5 items-center justify-center text-highlighted"
        >
          {glyph}
        </span>
      ) : (
        <span aria-hidden className="h-4 w-1.5 bg-hatch" />
      )}
      <BBSectionLabel as="h2">{title}</BBSectionLabel>
      {hint && <span className="ml-auto text-[11px] text-dimmed">{hint}</span>}
      {right && (
        <div className={`flex items-center gap-1.5${hint ? "" : " ml-auto"}`}>
          {right}
        </div>
      )}
    </div>
  );
}
