export function useSyncedDraft(value: string) {
  const [draft, setDraft] = useState(value);
  const [committed, setCommitted] = useState(value);
  if (committed !== value) {
    setCommitted(value);
    setDraft(value);
  }
  return [draft, setDraft] as const;
}
