import type { CarouselSlide } from "./showcaseTypes";

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

export default function ShowcaseCarousel({
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
  const { ref, onScroll, atStart, atEnd, nudge } = useCarouselScroll();

  const handlePrev = useCallback(() => {
    nudge(-1);
  }, [nudge]);

  const handleNext = useCallback(() => {
    nudge(1);
  }, [nudge]);

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
              <ArrowButton dir={-1} disabled={atStart} onClick={handlePrev} />
              <ArrowButton dir={1} disabled={atEnd} onClick={handleNext} />
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
