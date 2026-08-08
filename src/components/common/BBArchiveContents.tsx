interface BBArchiveContentsProps {
  contentResourceId: number;
  filename?: string | null | undefined;
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

  const openModal = useCallback((node: HTMLDialogElement | null) => {
    if (node && !node.open) node.showModal();
  }, []);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const checkEmpty = useCallback(
    (entries: unknown[]) => entries.length === 0,
    [],
  );

  const emptyMessage = useMemo(
    () => <BBEmpty message="This archive is empty." />,
    [],
  );

  return (
    <>
      <button
        type="button"
        className="ml-2 text-xs text-highlighted underline cursor-pointer"
        onClick={handleOpen}
      >
        view contents
      </button>
      {open && (
        <dialog
          ref={openModal}
          aria-label={filename ?? "Archive contents"}
          onClose={handleClose}
          className="fixed inset-0 z-50 m-0 flex h-full w-full max-h-none max-w-none items-center justify-center border-0 bg-transparent p-0 backdrop:bg-black/60"
        >
          <div className="relative z-10 max-h-[70dvh] w-[min(90vw,30rem)] overflow-auto border-2 border-default bg-accented text-default p-0">
            <div className="flex items-center justify-between border-b-2 border-default p-2">
              <span className="font-bold text-sm">
                {filename ?? "Archive contents"}
              </span>
              <button
                type="button"
                aria-label="Close"
                className="px-2 cursor-pointer hover:text-highlighted"
                onClick={handleClose}
              >
                <BBIcon name="close" />
              </button>
            </div>
            <div className="p-3 text-sm">
              <BBQueryBoundary
                query={query}
                isEmpty={checkEmpty}
                empty={emptyMessage}
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
          </div>
        </dialog>
      )}
    </>
  );
}
