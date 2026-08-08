import type { FeaturedItem } from "./showcaseTypes";

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span
      aria-label={`Rated ${rating.toFixed(1)} of 5`}
      className="inline-flex items-center gap-0.5"
    >
      {Array.from({ length: 5 }, (_, index) =>
        index < full ? (
          <Fa6SolidStar key={index} aria-hidden className="text-highlighted" />
        ) : (
          <Fa6RegularStar key={index} aria-hidden className="text-dimmed" />
        ),
      )}
    </span>
  );
}

export default function FeaturedPanel({
  item,
  kicker,
}: {
  item: FeaturedItem;
  kicker: string;
}) {
  return (
    <BBPanel>
      <div className="grid gap-0 sm:grid-cols-[minmax(0,240px)_1fr]">
        <Link
          to={item.href}
          aria-hidden
          tabIndex={-1}
          className="relative block border-b-2 border-default sm:border-b-0 sm:border-r-2"
        >
          <Thumb
            previewId={item.previewId}
            title={item.title}
            className="h-48 w-full sm:h-full"
            priority
          />
          <BBSectionLabel
            size="2xs"
            className="absolute left-0 top-2 bg-accented px-2 py-0.5 shadow-[2px_2px_0_rgba(0,0,0,0.5)]"
          >
            <Fa6SolidStar aria-hidden className="mr-1 inline" />
            {kicker}
          </BBSectionLabel>
        </Link>
        <div className="flex min-w-0 flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-3">
            <Link
              to={item.href}
              className="text-xl font-bold leading-tight text-highlighted hover:underline"
            >
              {item.title}
            </Link>
            {item.status && (
              <span className="shrink-0 border-2 border-default bg-accented px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-highlighted">
                {item.status}
              </span>
            )}
          </div>
          <p className="text-xs text-dimmed">
            by <span className="text-default">{item.author ?? "unknown"}</span>
            {item.metaLine && <> · {item.metaLine}</>}
            {item.rating !== null &&
              item.rating !== undefined &&
              (item.voteCount ?? 0) > 0 && (
                <>
                  {" · "}
                  <Stars rating={item.rating} />{" "}
                  <span className="text-dimmed">({item.voteCount})</span>
                </>
              )}
          </p>
          {item.contentHtml ? (
            <div className="relative max-h-52 overflow-hidden text-sm leading-relaxed text-default/90 mask-fade-b [&_.bb-code-img]:my-1.5 [&_.bb-code-img]:block [&_img]:border [&_img]:border-default">
              <BBHtml html={item.contentHtml} className="whitespace-pre-wrap" />
            </div>
          ) : (
            item.summary && (
              <p className="line-clamp-4 text-sm leading-relaxed text-default/90">
                {item.summary}
              </p>
            )
          )}
          <Link
            to={item.href}
            className="mt-auto self-start border-2 border-default bg-accented px-3 py-1 text-xs font-bold uppercase tracking-widest text-highlighted transition-colors hover:bg-elevated"
          >
            View <Fa6SolidArrowRight aria-hidden className="ml-1 inline" />
          </Link>
        </div>
      </div>
    </BBPanel>
  );
}
