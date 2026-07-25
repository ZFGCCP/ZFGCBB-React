import { useResizeObserver } from "./useResizeObserver";

export function useCarouselScroll() {
  const trackRef = useRef<HTMLElement | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback((element: HTMLElement) => {
    setAtStart(element.scrollLeft <= 2);
    setAtEnd(
      element.scrollLeft + element.clientWidth >= element.scrollWidth - 2,
    );
  }, []);

  const handleResize = useCallback(
    (element: HTMLElement) => {
      sync(element);
    },
    [sync],
  );

  const setResizeElement = useResizeObserver<HTMLElement>(handleResize);

  const ref = useCallback(
    (node: HTMLElement | null) => {
      trackRef.current = node;
      setResizeElement(node);
    },
    [setResizeElement],
  );

  const onScroll = useCallback(() => {
    if (trackRef.current) sync(trackRef.current);
  }, [sync]);

  const nudge = useCallback((direction: -1 | 1) => {
    const element = trackRef.current;
    if (!element) return;
    element.scrollBy({
      left: direction * Math.round(element.clientWidth * 0.85),
    });
  }, []);

  return { ref, onScroll, atStart, atEnd, nudge };
}
