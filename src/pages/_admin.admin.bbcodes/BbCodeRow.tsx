import type { BbCodeToggle } from "@/schemas/forum";

export function BbCodeRow({
  bbCode,
  pending,
  onToggle,
}: {
  bbCode: BbCodeToggle;
  pending: boolean;
  onToggle: (bbCode: BbCodeToggle) => void;
}) {
  const handleToggle = useCallback(() => {
    onToggle(bbCode);
  }, [bbCode, onToggle]);

  return (
    <div className="flex items-center gap-x-4 p-2 border-b border-default text-sm">
      <code className="w-32 font-mono text-highlighted">[{bbCode.code}]</code>
      <span
        className={`w-20 text-xs font-bold tracking-widest ${bbCode.enabled ? "text-highlighted" : "text-dimmed"}`}
      >
        {bbCode.enabled ? "ENABLED" : "DISABLED"}
      </span>
      <BBButton size="xs" disabled={pending} onClick={handleToggle}>
        {bbCode.enabled ? "Disable" : "Enable"}
      </BBButton>
    </div>
  );
}
