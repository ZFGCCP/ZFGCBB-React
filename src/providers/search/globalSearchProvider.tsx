import {
  createContext,
  use,
  useCallback,
  useMemo,
  useSyncExternalStore,
} from "react";
import SearchPalette from "@/components/search/SearchPalette";

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

let paletteOpen = false;
const paletteListeners = new Set<() => void>();

function emitPaletteChange() {
  for (const listener of paletteListeners) listener();
}

function setPaletteOpen(next: boolean) {
  if (paletteOpen === next) return;
  paletteOpen = next;
  emitPaletteChange();
}

function onPaletteHotkey(event: KeyboardEvent) {
  if (
    (event.key === "k" || event.key === "K") &&
    (event.metaKey || event.ctrlKey)
  ) {
    event.preventDefault();
    setPaletteOpen(!paletteOpen);
    return;
  }
  if (event.key === "/" && !isTypingTarget(event.target)) {
    event.preventDefault();
    setPaletteOpen(true);
  }
}

function subscribePalette(listener: () => void) {
  if (paletteListeners.size === 0)
    window.addEventListener("keydown", onPaletteHotkey);
  paletteListeners.add(listener);
  return () => {
    paletteListeners.delete(listener);
    if (paletteListeners.size === 0)
      window.removeEventListener("keydown", onPaletteHotkey);
  };
}

function getPaletteSnapshot() {
  return paletteOpen;
}

function getPaletteServerSnapshot() {
  return false;
}

export default function GlobalSearchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isOpen = useSyncExternalStore(
    subscribePalette,
    getPaletteSnapshot,
    getPaletteServerSnapshot,
  );
  const open = useCallback(() => setPaletteOpen(true), []);
  const close = useCallback(() => setPaletteOpen(false), []);

  const value = useMemo(() => ({ open, close, isOpen }), [open, close, isOpen]);

  return (
    <GlobalSearchContext.Provider value={value}>
      {children}
      {isOpen && <SearchPalette onClose={close} />}
    </GlobalSearchContext.Provider>
  );
}
