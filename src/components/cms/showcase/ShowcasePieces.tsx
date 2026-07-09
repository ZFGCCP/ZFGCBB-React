import { useCarouselScroll } from "@/hooks/useCarouselScroll";
import { Link } from "react-router";

export function SectionBar({
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

export function Thumb({
  previewId,
  title,
  className,
  letterClassName,
}: {
  previewId: number | null;
  title: string;
  className: string;
  letterClassName?: string;
}) {
  if (previewId) {
    return (
      <img
        src={contentUrl(previewId)}
        alt=""
        loading="lazy"
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

export type FeaturedItem = {
  previewId: number | null;
  title: string;
  author: string | null;
  status?: string | null;
  rating: number | null;
  voteCount: number | null;
  summary: string | null;
  contentHtml?: string | null;
  href: string;
  metaLine?: string;
};

export function FeaturedPanel({
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
          />
          <BBSectionLabel
            size="2xs"
            className="absolute left-0 top-2 bg-accented px-2 py-0.5 shadow-[2px_2px_0_rgba(0,0,0,0.5)]"
          >
            ★ {kicker}
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
            {item.rating != null && (item.voteCount ?? 0) > 0 && (
              <>
                {" · "}
                <Stars rating={item.rating} />{" "}
                <span className="text-dimmed">({item.voteCount})</span>
              </>
            )}
          </p>
          {item.contentHtml ? (
            <Link
              to={item.href}
              aria-label={`Read more about ${item.title}`}
              className="relative block max-h-52 overflow-hidden text-sm leading-relaxed text-default/90 mask-fade-b [&_.bb-code-img]:my-1.5 [&_.bb-code-img]:block [&_img]:border [&_img]:border-default"
            >
              <BBHtml html={item.contentHtml} className="whitespace-pre-wrap" />
            </Link>
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

export type RailItem = {
  previewId: number | null;
  title: string;
  href: string;
  subtitle: React.ReactNode;
};

export function HighlightRail({
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
        {items.map((item, index) => (
          <li key={item.href + index}>
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

function ArrowButton({
  dir,
  disabled,
  onClick,
}: {
  dir: -1 | 1;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={dir === -1 ? "Scroll left" : "Scroll right"}
      onClick={onClick}
      disabled={disabled}
      className="flex h-6 w-6 items-center justify-center border-2 border-default bg-muted text-sm leading-none text-highlighted transition-colors enabled:hover:bg-elevated disabled:opacity-30"
    >
      <BBIcon name="arrow" className={dir === -1 ? "-scale-x-100" : ""} />
    </button>
  );
}

export type CarouselSlide = { key: string; content: React.ReactNode };

export function ShowcaseCarousel({
  title,
  viewAllHref,
  viewAllLabel = "View all",
  slides,
}: {
  title: string;
  viewAllHref: string;
  viewAllLabel?: string;
  slides: CarouselSlide[];
}) {
  const { ref, onScroll, atStart, atEnd, nudge } =
    useCarouselScroll<HTMLUListElement>();

  return (
    <section aria-label={title}>
      <SectionBar
        title={title}
        right={
          <>
            <Link
              to={viewAllHref}
              className="border-2 border-default bg-muted px-2 py-0.5 text-[11px] font-bold uppercase tracking-widest text-highlighted transition-colors hover:bg-elevated"
            >
              {viewAllLabel}{" "}
              <Fa6SolidArrowRight aria-hidden className="inline" />
            </Link>
            <span className="hidden gap-1 sm:flex">
              <ArrowButton
                dir={-1}
                disabled={atStart}
                onClick={() => nudge(-1)}
              />
              <ArrowButton dir={1} disabled={atEnd} onClick={() => nudge(1)} />
            </span>
          </>
        }
      />
      <div className="border-2 border-default bg-default p-3">
        <ul
          ref={ref}
          onScroll={onScroll}
          className="motion-safe:showcase-stagger flex snap-x snap-mandatory gap-3 overflow-x-auto motion-safe:scroll-smooth pb-1 [scrollbar-width:thin]"
        >
          {slides.map((slide) => (
            <li
              key={slide.key}
              className="flex w-52 shrink-0 snap-start sm:w-56"
            >
              {slide.content}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
