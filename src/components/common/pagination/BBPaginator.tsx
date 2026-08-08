export interface BBPaginatorProps {
  numPages: number;
  currentPage: number;
  onPageChange: (pageNo: number) => void;
  className?: string;
}

type PageItem =
  | { kind: "page"; page: number }
  | { kind: "gap"; side: "left" | "right" };

const VISIBLE_SLOTS = 7;

function buildPageItems(current: number, total: number): PageItem[] {
  const items: PageItem[] = [];

  if (total <= VISIBLE_SLOTS) {
    for (let page = 1; page <= total; page += 1) {
      items.push({ kind: "page", page });
    }
    return items;
  }

  const siblings = Math.floor((VISIBLE_SLOTS - 5) / 2);
  const leftGap = current > VISIBLE_SLOTS - 3;
  const rightGap = current < total - (VISIBLE_SLOTS - 4);
  const windowStart = leftGap
    ? rightGap
      ? current - siblings
      : total - (VISIBLE_SLOTS - 3)
    : 2;
  const windowEnd = rightGap
    ? leftGap
      ? current + siblings
      : VISIBLE_SLOTS - 2
    : total - 1;

  items.push({ kind: "page", page: 1 });
  if (leftGap) {
    items.push({ kind: "gap", side: "left" });
  }
  for (let page = windowStart; page <= windowEnd; page += 1) {
    items.push({ kind: "page", page });
  }
  if (rightGap) {
    items.push({ kind: "gap", side: "right" });
  }
  items.push({ kind: "page", page: total });

  return items;
}

const cellBase =
  "inline-flex size-10 shrink-0 items-center justify-center border-2 border-default " +
  "text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2";

const navButton =
  `group ${cellBase} bg-muted text-default hover:bg-elevated active:translate-y-px ` +
  "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-muted";

const inactivePage = `${cellBase} bg-muted text-default tabular-nums hover:bg-elevated active:translate-y-px`;

const activePage =
  `${cellBase} bg-elevated font-bold text-highlighted tabular-nums cursor-default ` +
  "shadow-[inset_0_-3px_0_var(--text-color-highlighted)]";

function PaginatorPageButton({
  page,
  current,
  onPageChange,
}: {
  page: number;
  current: number;
  onPageChange: (page: number) => void;
}) {
  const isCurrent = page === current;
  const selectPage = useCallback(() => {
    onPageChange(page);
  }, [onPageChange, page]);

  return (
    <button
      type="button"
      aria-label={`Page ${page}`}
      aria-current={isCurrent ? "page" : undefined}
      disabled={isCurrent}
      className={isCurrent ? activePage : inactivePage}
      onClick={selectPage}
    >
      {page}
    </button>
  );
}

export default function BBPaginator({
  numPages,
  currentPage,
  onPageChange,
  className = "",
}: BBPaginatorProps) {
  const total = Math.max(numPages, 1);
  const current = Math.min(Math.max(currentPage, 1), total);
  const isFirst = current <= 1;
  const isLast = current >= total;

  const items = useMemo(() => buildPageItems(current, total), [current, total]);

  const goTo = useCallback(
    (page: number) => {
      const clamped = Math.min(Math.max(page, 1), total);
      if (clamped !== current) onPageChange(clamped);
    },
    [current, onPageChange, total],
  );
  const goToFirst = useCallback(() => {
    goTo(1);
  }, [goTo]);
  const goToPrevious = useCallback(() => {
    goTo(current - 1);
  }, [current, goTo]);
  const goToNext = useCallback(() => {
    goTo(current + 1);
  }, [current, goTo]);
  const goToLast = useCallback(() => {
    goTo(total);
  }, [goTo, total]);

  return (
    <nav
      aria-label="Pagination"
      className={`flex items-center justify-start gap-1.5 ${className}`}
    >
      <button
        type="button"
        aria-label="First page"
        className={navButton}
        disabled={isFirst}
        onClick={goToFirst}
      >
        <span className="inline-flex items-center transition-transform group-hover:-translate-x-0.5">
          <BBIcon name="arrow" className="-scale-x-100" />
          <BBIcon name="arrow" className="-ml-1.5 -scale-x-100" />
        </span>
      </button>
      <button
        type="button"
        aria-label="Previous page"
        className={navButton}
        disabled={isFirst}
        onClick={goToPrevious}
      >
        <span className="inline-flex items-center transition-transform group-hover:-translate-x-0.5">
          <BBIcon name="arrow" className="-scale-x-100" />
        </span>
      </button>

      <div className="hidden items-center gap-1.5 sm:flex">
        {items.map((item) => {
          if (item.kind === "gap") {
            return (
              <span
                key={`gap-${item.side}`}
                aria-hidden
                className="inline-flex size-10 shrink-0 select-none items-center justify-center text-dimmed"
              >
                …
              </span>
            );
          }
          return (
            <PaginatorPageButton
              key={item.page}
              page={item.page}
              current={current}
              onPageChange={goTo}
            />
          );
        })}
      </div>

      <span className="inline-flex h-10 min-w-20 shrink-0 items-center justify-center border-2 border-default bg-muted px-3 text-sm tabular-nums text-highlighted sm:hidden">
        {current} / {total}
      </span>

      <button
        type="button"
        aria-label="Next page"
        className={navButton}
        disabled={isLast}
        onClick={goToNext}
      >
        <span className="inline-flex items-center transition-transform group-hover:translate-x-0.5">
          <BBIcon name="arrow" />
        </span>
      </button>
      <button
        type="button"
        aria-label="Last page"
        className={navButton}
        disabled={isLast}
        onClick={goToLast}
      >
        <span className="inline-flex items-center transition-transform group-hover:translate-x-0.5">
          <BBIcon name="arrow" />
          <BBIcon name="arrow" className="-ml-1.5" />
        </span>
      </button>
    </nav>
  );
}
