export function useResizeObserver<TElement extends Element>(
  onResize: (element: TElement, entry: ResizeObserverEntry) => void,
): React.RefCallback<TElement> {
  const observerRef = useRef<ResizeObserver>(null);

  return useCallback(
    (element: TElement | null): (() => void) | undefined => {
      observerRef.current?.disconnect();
      observerRef.current = null;

      if (!element || typeof ResizeObserver === "undefined") {
        return undefined;
      }

      const observer = new ResizeObserver((entries) => {
        const entry = entries.find(({ target }) => target === element);
        if (entry) {
          onResize(element, entry);
        }
      });

      observer.observe(element);
      observerRef.current = observer;

      return () => {
        observer.disconnect();
        if (observerRef.current === observer) {
          observerRef.current = null;
        }
      };
    },
    [onResize],
  );
}
