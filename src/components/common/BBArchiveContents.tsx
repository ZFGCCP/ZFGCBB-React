interface BBArchiveContentsProps {
  contentResourceId: number;
  filename?: string | null;
}

export default function BBArchiveContents({
  contentResourceId,
  filename,
}: BBArchiveContentsProps) {
  const [open, setOpen] = useState(false);
  const query = useBBQuery(`/content/archive/${contentResourceId}`, {
    enabled: open,
    schema: ArchiveEntryListSchema,
  });

  return (
    <>
      <button
        type="button"
        className="ml-2 text-xs text-highlighted underline cursor-pointer"
        onClick={() => setOpen(true)}
      >
        view contents
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <button
            type="button"
            aria-label="Close archive contents"
            onClick={() => setOpen(false)}
            className="absolute inset-0 cursor-default bg-black/60"
          />
          <dialog
            open
            aria-label={filename ?? "Archive contents"}
            className="relative z-10 max-h-[70dvh] w-[min(90vw,30rem)] overflow-auto border-2 border-default bg-accented text-default p-0"
          >
            <div className="flex items-center justify-between border-b-2 border-default p-2">
              <span className="font-bold text-sm">
                {filename ?? "Archive contents"}
              </span>
              <button
                type="button"
                aria-label="Close"
                className="px-2 cursor-pointer hover:text-highlighted"
                onClick={() => setOpen(false)}
              >
                <BBIcon name="close" />
              </button>
            </div>
            <div className="p-3 text-sm">
              <BBQueryBoundary
                query={query}
                isEmpty={(entries) => entries.length === 0}
                empty={<BBEmpty message="This archive is empty." />}
              >
                {(entries) => (
                  <ul className="space-y-1">
                    {entries.map((entry) => (
                      <li
                        key={entry.name}
                        className="flex justify-between gap-4"
                      >
                        <span className="break-all">{entry.name}</span>
                        <span className="text-dimmed whitespace-nowrap">
                          {formatFileSize(entry.size)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </BBQueryBoundary>
            </div>
          </dialog>
        </div>
      )}
    </>
  );
}
