import { useCallback, useRef, useState } from "react";

export function useCarouselScroll<TElement extends HTMLElement>() {
  const trackRef = useRef<TElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback((element: TElement) => {
    setAtStart(element.scrollLeft <= 2);
    setAtEnd(
      element.scrollLeft + element.clientWidth >= element.scrollWidth - 2,
    );
  }, []);

  const ref = useCallback(
    (node: TElement | null) => {
      trackRef.current = node;
      if (!node) return;
      sync(node);
      const observer = new ResizeObserver(() => sync(node));
      observer.observe(node);
      return () => observer.disconnect();
    },
    [sync],
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
