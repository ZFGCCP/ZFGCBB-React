import { useCallback, useRef, useState } from "react";

export function useCarouselScroll<T extends HTMLElement>() {
  const trackRef = useRef<T>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback((el: T) => {
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  const ref = useCallback(
    (node: T | null) => {
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

  const nudge = useCallback((dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.85) });
  }, []);

  return { ref, onScroll, atStart, atEnd, nudge };
}
