export default function Thumb({
  previewId,
  title,
  className,
  letterClassName,
  priority,
}: {
  previewId?: number | undefined;
  title: string;
  className: string;
  letterClassName?: string | undefined;
  priority?: boolean | undefined;
}) {
  if (previewId) {
    return (
      <img
        src={contentUrl(previewId)}
        alt=""
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className={`${className} object-cover`}
      />
    );
  }
  return (
    <div
      aria-hidden
      className={`${className} flex items-center justify-center bg-placeholder`}
    >
      <span
        className={`font-bold text-dimmed select-none${letterClassName ? ` ${letterClassName}` : ""}`}
      >
        {title.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}
