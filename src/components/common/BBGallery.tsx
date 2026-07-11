export interface BBGalleryImage {
  contentResourceId: number;
  caption?: string | null;
}

export default function BBGallery({ images }: { images: BBGalleryImage[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const current = index != null ? images[index] : null;

  const openModal = useCallback((node: HTMLDialogElement | null) => {
    if (node && !node.open) node.showModal();
  }, []);

  useKeyDown((event) => {
    if (event.key === "ArrowRight")
      setIndex((prevIndex) =>
        prevIndex == null ? prevIndex : (prevIndex + 1) % images.length,
      );
    else if (event.key === "ArrowLeft")
      setIndex((prevIndex) =>
        prevIndex == null
          ? prevIndex
          : (prevIndex - 1 + images.length) % images.length,
      );
  }, index != null);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((image, index) => (
          <button
            key={image.contentResourceId}
            type="button"
            className="group relative border-2 border-default bg-muted cursor-pointer overflow-hidden"
            onClick={(event) => {
              event.currentTarget.focus();
              setIndex(index);
            }}
            title={image.caption ?? undefined}
          >
            <img
              src={contentUrl(image.contentResourceId)}
              alt={image.caption ?? `screenshot ${index + 1}`}
              loading="lazy"
              className="aspect-video w-full object-cover transition duration-200 motion-safe:group-hover:scale-105 group-hover:brightness-110"
            />
            {image.caption && (
              <span className="absolute inset-x-0 bottom-0 truncate bg-black/70 px-2 py-0.5 text-left text-xs text-highlighted opacity-0 transition group-hover:opacity-100">
                {image.caption}
              </span>
            )}
          </button>
        ))}
      </div>

      {current && (
        <dialog
          ref={openModal}
          aria-label="Image viewer"
          onClose={() => setIndex(null)}
          className="fixed inset-0 z-50 m-0 flex h-full w-full max-h-none max-w-none items-center justify-center border-0 bg-transparent p-0 backdrop:bg-black/85"
        >
          <button
            type="button"
            aria-label="Close viewer"
            tabIndex={-1}
            onClick={() => setIndex(null)}
            className="absolute inset-0 cursor-default"
          />
          <BBButton
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 text-xl text-default"
            onClick={() =>
              setIndex((prevIndex) =>
                prevIndex == null
                  ? prevIndex
                  : (prevIndex - 1 + images.length) % images.length,
              )
            }
          >
            <BBIcon name="arrow" className="-scale-x-100" />
          </BBButton>
          <figure className="relative z-10 max-w-[92vw] border-2 border-default bg-accented text-default">
            <img
              src={contentUrl(current.contentResourceId)}
              alt={current.caption ?? "screenshot"}
              className="max-h-[78dvh] max-w-[92vw] object-contain"
            />
            <figcaption className="flex items-center justify-between gap-4 border-t-2 border-default px-3 py-1.5 text-sm">
              <span className="truncate">{current.caption ?? " "}</span>
              <span className="whitespace-nowrap text-dimmed">
                {(index ?? 0) + 1} / {images.length}
              </span>
            </figcaption>
          </figure>
          <BBButton
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 text-xl text-default"
            onClick={() =>
              setIndex((prevIndex) =>
                prevIndex == null ? prevIndex : (prevIndex + 1) % images.length,
              )
            }
          >
            <BBIcon name="arrow" />
          </BBButton>
        </dialog>
      )}
    </>
  );
}
