import type { WikiImportNamespace } from "@/schemas/system";

interface WikiNamespaceRowProps {
  namespace: WikiImportNamespace;
  pending: boolean;
  onSave: (sourceNamespaceId: number, name: string) => void;
}

export default function WikiNamespaceRow({
  namespace,
  pending,
  onSave,
}: WikiNamespaceRowProps) {
  const [draft, setDraft] = useState(namespace.namespaceName);
  const dirty = draft.trim() !== namespace.namespaceName;

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setDraft(event.target.value);
    },
    [],
  );
  const handleSave = useCallback(() => {
    onSave(namespace.sourceNamespaceId, draft.trim());
  }, [draft, namespace.sourceNamespaceId, onSave]);

  return (
    <div className="flex items-center gap-3 border-b-2 border-default p-2">
      <span className="w-12 shrink-0 text-right text-sm text-dimmed">
        {namespace.sourceNamespaceId}
      </span>
      <input
        type="text"
        value={draft}
        onChange={handleChange}
        aria-label={`Name for source namespace ${String(namespace.sourceNamespaceId)}`}
        className="min-w-0 flex-1 border-2 border-default bg-default px-2 py-1 text-sm"
      />
      <BBButton disabled={!dirty || pending} onClick={handleSave}>
        {pending ? "Saving..." : "Save"}
      </BBButton>
    </div>
  );
}

export { WikiNamespaceRow };
