interface BBShowMoreProps {
  children: React.ReactNode;
  className?: string;
  collapsedMaxHeightClassName?: string;
}

export default function BBShowMore({
  children,
  className,
  collapsedMaxHeightClassName = "max-h-[75dvh]",
}: BBShowMoreProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const contentId = useId();
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    if (expanded) return;
    const node = contentRef.current;
    if (!node) return;
    const check = () =>
      setOverflowing(node.scrollHeight > node.clientHeight + 1);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(node);
    return () => observer.disconnect();
  }, [expanded]);

  const collapsed = !expanded && overflowing;

  return (
    <div className={className}>
      <div className="relative">
        <div
          id={contentId}
          ref={contentRef}
          className={
            expanded
              ? undefined
              : `overflow-hidden ${collapsedMaxHeightClassName}${collapsed ? " mask-fade-b" : ""}`
          }
        >
          {children}
        </div>

        {(collapsed || expanded) && (
          <div
            className={`pointer-events-none z-10 flex justify-center ${
              expanded
                ? "sticky bottom-4 pt-2"
                : "absolute inset-x-0 bottom-0 pb-3"
            }`}
          >
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={contentId}
              onClick={() => setExpanded((value) => !value)}
              className="pointer-events-auto inline-flex cursor-pointer items-center gap-1 rounded-full border-2 border-default bg-accented px-3 py-1 text-sm text-dimmed shadow-[2px_2px_0_rgba(0,0,0,0.5)] transition-colors hover:bg-default hover:text-highlighted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverted"
            >
              {expanded ? "Show Less" : "Show More"}
              <BBIcon name={expanded ? "sort-up" : "sort-down"} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
