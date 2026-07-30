export function useKeyDown(
  handler: (event: KeyboardEvent) => void,
  enabled = true,
) {
  const handlerRef = useRef(handler);
  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  useEffect((): (() => void) | undefined => {
    if (!enabled) return undefined;
    const listener = (event: KeyboardEvent) => {
      handlerRef.current(event);
    };
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [enabled]);
}
