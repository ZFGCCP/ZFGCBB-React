import type { BbCodeToggle } from "@/schemas/forum";
import type { ContentScope } from "@/types/content";

const SURFACES: {
  surface: ContentScope;
  label: string;
  of: keyof BbCodeToggle;
}[] = [
  { surface: "FORUM", label: "Forum", of: "honouredInForum" },
  { surface: "WIKI", label: "Wiki", of: "honouredInWiki" },
  { surface: "PROJECT", label: "Projects", of: "honouredInProject" },
  { surface: "RESOURCE", label: "Resources", of: "honouredInResource" },
  { surface: "SIGNATURE", label: "Signatures", of: "honouredInSignature" },
];

function SurfaceCheckbox({
  bbCode,
  surface,
  label,
  honoured,
  pending,
  onToggleSurface,
}: {
  bbCode: BbCodeToggle;
  surface: ContentScope;
  label: string;
  honoured: boolean;
  pending: boolean;
  onToggleSurface: (
    bbCode: BbCodeToggle,
    surface: ContentScope,
    honoured: boolean,
  ) => void;
}) {
  const handleChange = useCallback(() => {
    onToggleSurface(bbCode, surface, !honoured);
  }, [bbCode, surface, honoured, onToggleSurface]);

  return (
    <label
      className={`flex items-center gap-x-1 text-xs ${bbCode.scopable ? "" : "text-dimmed"}`}
      title={
        bbCode.scopable ? undefined : "Always on. Other markup depends on it."
      }
    >
      <input
        type="checkbox"
        checked={honoured}
        disabled={pending || !bbCode.scopable || !bbCode.enabled}
        onChange={handleChange}
      />
      {label}
    </label>
  );
}

function honouredOnAnySurface(bbCode: BbCodeToggle) {
  if (!bbCode.scopable) return true;
  return SURFACES.some((each) => bbCode[each.of] === true);
}

export function BbCodeRow({
  bbCode,
  pending,
  onToggle,
  onToggleSurface,
}: {
  bbCode: BbCodeToggle;
  pending: boolean;
  onToggle: (bbCode: BbCodeToggle) => void;
  onToggleSurface: (
    bbCode: BbCodeToggle,
    surface: ContentScope,
    honoured: boolean,
  ) => void;
}) {
  const handleToggle = useCallback(() => {
    onToggle(bbCode);
  }, [bbCode, onToggle]);
  const rendersSomewhere = bbCode.enabled && honouredOnAnySurface(bbCode);

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 p-2 border-b border-default text-sm">
      <code className="w-32 font-mono text-highlighted">[{bbCode.code}]</code>
      <span
        className={`w-24 text-xs font-bold tracking-widest ${rendersSomewhere ? "text-highlighted" : "text-dimmed"}`}
        title={
          bbCode.enabled && !rendersSomewhere
            ? "Enabled, but switched off everywhere."
            : undefined
        }
      >
        {rendersSomewhere ? "ENABLED" : bbCode.enabled ? "NOWHERE" : "DISABLED"}
      </span>
      <BBButton size="xs" disabled={pending} onClick={handleToggle}>
        {bbCode.enabled ? "Disable" : "Enable"}
      </BBButton>
      <div className="flex flex-wrap items-center gap-x-3">
        {SURFACES.map((each) => (
          <SurfaceCheckbox
            key={each.surface}
            bbCode={bbCode}
            surface={each.surface}
            label={each.label}
            honoured={!bbCode.scopable || bbCode[each.of] === true}
            pending={pending}
            onToggleSurface={onToggleSurface}
          />
        ))}
      </div>
    </div>
  );
}
