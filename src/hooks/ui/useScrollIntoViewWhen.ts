export function useScrollIntoViewWhen<TElement extends HTMLElement>(
  shouldScrollIntoView: boolean,
  block: ScrollLogicalPosition = "start",
): React.RefObject<TElement | null> {
  const elementRef = useRef<TElement>(null);

  useEffect(() => {
    if (!shouldScrollIntoView) return;
    elementRef.current?.scrollIntoView({ block });
  }, [shouldScrollIntoView, block]);

  return elementRef;
}
