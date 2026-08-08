import type { SearchGroup, SearchHit, SearchRealm } from "@/types/search";

function SearchPaletteRealm({
  realm,
  active,
  onSelect,
}: {
  realm: SearchRealm;
  active: boolean;
  onSelect: (type: string) => void;
}) {
  const select = useCallback(() => {
    onSelect(realm.type);
  }, [onSelect, realm.type]);

  return (
    <button
      type="button"
      onClick={select}
      className={`border-2 border-default px-2.5 py-0.5 text-xs tracking-wide ${
        active
          ? "bg-elevated font-bold text-highlighted"
          : "bg-muted text-dimmed hover:bg-elevated hover:text-highlighted"
      }`}
    >
      {realm.label}
    </button>
  );
}

function SearchPaletteHit({
  hit,
  index,
  selected,
  query,
  onActivate,
  onOpen,
}: {
  hit: SearchHit;
  index: number;
  selected: boolean;
  query: string;
  onActivate: (index: number) => void;
  onOpen: (hit: SearchHit) => void;
}) {
  const activate = useCallback(() => {
    onActivate(index);
  }, [index, onActivate]);
  const open = useCallback(() => {
    onOpen(hit);
  }, [hit, onOpen]);

  return (
    <li>
      <button
        type="button"
        onMouseMove={activate}
        onClick={open}
        className={`flex w-full items-start gap-2 px-3 py-2 text-left transition-colors ${
          selected ? "bg-elevated" : "hover:bg-elevated/60"
        }`}
      >
        <span
          aria-hidden
          className={`w-3 shrink-0 pt-0.5 text-center text-xs font-bold ${
            selected ? "text-highlighted" : "text-transparent"
          }`}
        >
          »
        </span>
        <span className="min-w-0 grow">
          <span className="block truncate text-sm text-highlighted">
            <HighlightMatch text={hit.title} query={query} />
          </span>
          {hit.snippet && (
            <span className="mt-0.5 block truncate text-xs text-dimmed">
              <HighlightMatch text={hit.snippet} query={query} />
            </span>
          )}
        </span>
        {hit.context && (
          <span className="mt-0.5 shrink-0 whitespace-nowrap border border-default bg-accented px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-dimmed">
            {hit.context}
          </span>
        )}
      </button>
    </li>
  );
}

function SearchPaletteGroup({
  group,
  startIndex,
  active,
  query,
  onActivate,
  onOpen,
}: {
  group: SearchGroup;
  startIndex: number;
  active: number;
  query: string;
  onActivate: (index: number) => void;
  onOpen: (hit: SearchHit) => void;
}) {
  return (
    <section aria-label={group.label}>
      <header className="sticky top-0 flex items-center gap-2 border-y-2 border-default bg-accented px-3 py-1">
        <span aria-hidden className="h-3 w-1.5 bg-hatch" />
        <BBSectionLabel size="2xs">{group.label}</BBSectionLabel>
        <span className="text-[10px] tracking-widest text-dimmed">
          ({group.total})
        </span>
      </header>
      <ul className="divide-y divide-default/40">
        {group.hits.map((hit, offset) => {
          const index = startIndex + offset;
          return (
            <SearchPaletteHit
              key={`${hit.type}:${hit.url}`}
              hit={hit}
              index={index}
              selected={index === active}
              query={query}
              onActivate={onActivate}
              onOpen={onOpen}
            />
          );
        })}
      </ul>
    </section>
  );
}

export default function SearchPalette({ onClose }: { onClose: () => void }) {
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const showModal = useCallback((node: HTMLDialogElement | null) => {
    if (node && !node.open) {
      node.showModal();
      inputRef.current?.focus();
    }
  }, []);
  const updateDebounced = useCallback((value: string) => {
    setDebounced(value);
  }, []);
  const debounceSearch = useDebouncedCallback(updateDebounced, 220);

  const scope = `${debounced} ${filter}`;
  const [selection, setSelection] = useState({ scope, index: 0 });
  const active = selection.scope === scope ? selection.index : 0;
  const setActive = useCallback(
    (index: number) => {
      setSelection({ scope, index });
    },
    [scope],
  );

  const query = new URLSearchParams({ q: debounced });
  if (filter) query.set("types", filter);
  const enabled = debounced.trim().length >= 2;
  const { data, isFetching, isError, refetch } = useBBQuery(
    `/search?${query.toString()}`,
    {
      enabled,
      staleTime: 30000,
      queryKey: `search:${filter}:${debounced}`,
      schema: SearchResultsSchema,
    },
  );
  const { data: filters = [] } = useSearchRealms();
  const flatHits = useMemo<SearchHit[]>(
    () => (data ? data.groups.flatMap((group) => group.hits) : []),
    [data],
  );

  const openHit = useCallback(
    (hit: SearchHit | undefined) => {
      if (!hit) return;
      onClose();
      void navigate(hit.url);
    },
    [navigate, onClose],
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActive(Math.min(active + 1, Math.max(flatHits.length - 1, 0)));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActive(Math.max(active - 1, 0));
      } else if (event.key === "Enter") {
        event.preventDefault();
        if (flatHits[active]) {
          openHit(flatHits[active]);
          return;
        }
        if (enabled) {
          onClose();
          void navigate(`/search/${encodeURIComponent(debounced)}`);
        }
      }
    },
    [
      active,
      debounced,
      enabled,
      flatHits,
      navigate,
      onClose,
      openHit,
      setActive,
    ],
  );

  const orderedGroups = useMemo(() => {
    let runningIndex = 0;
    const result: Array<{
      group: NonNullable<typeof data>["groups"][number];
      startIndex: number;
    }> = [];
    for (const group of data?.groups ?? []) {
      if (group.hits.length > 0) {
        result.push({ group, startIndex: runningIndex });
        runningIndex += group.hits.length;
      }
    }
    return result;
  }, [data]);
  const changeTerm = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTerm(event.target.value);
      debounceSearch(event.target.value);
    },
    [debounceSearch],
  );
  const selectFilter = useCallback((type: string) => {
    setFilter(type);
  }, []);
  const retry = useCallback(() => {
    void refetch();
  }, [refetch]);
  const showAllResults = useCallback(() => {
    onClose();
    void navigate(`/search/${encodeURIComponent(debounced)}`);
  }, [debounced, navigate, onClose]);

  return (
    <dialog
      ref={showModal}
      aria-label="Site search"
      onClose={onClose}
      className="fixed inset-0 z-100 m-0 flex h-full max-h-none w-full max-w-none items-start justify-center border-0 bg-transparent px-4 pt-[8vh] sm:pt-[12vh]"
    >
      <button
        type="button"
        aria-label="Close search"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/70 animate-[searchFade_150ms_ease-out]"
      />
      <div className="relative w-full max-w-2xl overflow-hidden border-2 border-default bg-muted shadow-panel motion-safe:animate-[searchRise_160ms_ease-out]">
        <div className="flex items-center gap-2.5 border-b-2 border-default bg-accented px-3 py-1.5">
          <span aria-hidden className="h-4 w-1.5 bg-hatch" />
          <BBSectionLabel size="2xs">Search ZFGC</BBSectionLabel>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="ml-auto flex h-5 w-5 items-center justify-center border border-default bg-muted text-xs leading-none text-dimmed hover:bg-elevated hover:text-highlighted"
          >
            <BBIcon name="close" />
          </button>
        </div>
        <div className="flex items-center gap-2 border-b-2 border-default bg-muted px-3 py-2.5">
          <BBIcon name="search" />
          <input
            ref={inputRef}
            value={term}
            onChange={changeTerm}
            onKeyDown={onKeyDown}
            placeholder="Search threads, articles, projects, resources…"
            className="min-w-0 grow border-2 border-default bg-default px-2.5 py-1.5 text-sm text-highlighted placeholder:text-dimmed focus:bg-elevated focus:outline-none"
            aria-label="Search query"
            autoComplete="off"
            spellCheck={false}
          />
          {isFetching && enabled && (
            <span className="shrink-0 animate-pulse text-[11px] tracking-widest text-dimmed">
              …
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-1.5 border-b-2 border-default bg-accented px-3 py-2">
          {filters.map((realm) => {
            const isActive = filter === realm.type;
            return (
              <SearchPaletteRealm
                key={realm.type || "all"}
                realm={realm}
                active={isActive}
                onSelect={selectFilter}
              />
            );
          })}
          {data && data.total > 0 && (
            <span className="ml-auto self-center text-[11px] tracking-widest text-dimmed">
              {data.total} MATCH{data.total === 1 ? "" : "ES"}
            </span>
          )}
        </div>
        <div className="max-h-[52vh] overflow-y-auto bg-muted scrollbar-color-default">
          {!enabled && (
            <p className="px-4 py-8 text-center text-sm text-dimmed">
              Type at least two characters to search.
            </p>
          )}

          {enabled && isError && (
            <BBErrorInline message="Search hit an error." onRetry={retry} />
          )}

          {enabled && data && data.total === 0 && !isFetching && (
            <p className="px-4 py-8 text-center text-sm text-dimmed">
              No matches for “{debounced}”. Try a different term or realm.
            </p>
          )}

          {enabled &&
            orderedGroups.map(({ group, startIndex }) => (
              <SearchPaletteGroup
                key={group.type}
                group={group}
                startIndex={startIndex}
                active={active}
                query={debounced}
                onActivate={setActive}
                onOpen={openHit}
              />
            ))}
        </div>
        <div className="flex items-center justify-between border-t-2 border-default bg-accented px-3 py-1.5 text-[10px] tracking-widest text-dimmed">
          <span className="flex items-center gap-2">
            <kbd className="border border-default bg-muted px-1">
              <Fa6SolidUpDown aria-hidden />
            </kbd>
            <span>browse</span>
            <kbd className="border border-default bg-muted px-1">↵</kbd>
            <span>open</span>
            <kbd className="border border-default bg-muted px-1">esc</kbd>
            <span>close</span>
          </span>
          {enabled && (
            <button
              type="button"
              className="font-bold tracking-widest text-highlighted hover:underline"
              onClick={showAllResults}
            >
              ALL RESULTS <Fa6SolidArrowRight aria-hidden className="inline" />
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
}
