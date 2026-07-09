type GlobalSearchContextValue = {
  open: () => void;
  close: () => void;
  isOpen: boolean;
};

const GlobalSearchContext = createContext<GlobalSearchContextValue>({
  open: () => {},
  close: () => {},
  isOpen: false,
});

export function useGlobalSearch() {
  return use(GlobalSearchContext);
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

export default function GlobalSearchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useKeyDown((event) => {
    if (
      (event.key === "k" || event.key === "K") &&
      (event.metaKey || event.ctrlKey)
    ) {
      event.preventDefault();
      setIsOpen((wasOpen) => !wasOpen);
      return;
    }
    if (event.key === "/" && !isTypingTarget(event.target)) {
      event.preventDefault();
      setIsOpen(true);
    }
  });

  const value = useMemo(() => ({ open, close, isOpen }), [open, close, isOpen]);

  return (
    <GlobalSearchContext.Provider value={value}>
      {children}
      {isOpen && <SearchPalette onClose={close} />}
    </GlobalSearchContext.Provider>
  );
}
