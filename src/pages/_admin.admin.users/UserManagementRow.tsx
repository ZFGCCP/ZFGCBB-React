import type * as v from "valibot";
import type { UserSummarySchema } from "@/schemas/user";

export type DeletionMode = "ANONYMIZE" | "PURGE";
export type UserSummary = v.InferOutput<typeof UserSummarySchema>;

export function isDeletionMode(value: string): value is DeletionMode {
  return value === "ANONYMIZE" || value === "PURGE";
}

export function UserManagementRow({
  user,
  selected,
  mode,
  pending,
  onModeChange,
  onConfirm,
  onCancel,
  onStart,
}: {
  user: UserSummary;
  selected: boolean;
  mode: DeletionMode;
  pending: boolean;
  onModeChange: (mode: DeletionMode) => void;
  onConfirm: (userId: number) => void;
  onCancel: () => void;
  onStart: (userId: number) => void;
}) {
  const handleModeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      if (isDeletionMode(event.target.value)) {
        onModeChange(event.target.value);
      }
    },
    [onModeChange],
  );
  const handleConfirm = useCallback(() => {
    onConfirm(user.userId);
  }, [onConfirm, user.userId]);
  const handleStart = useCallback(() => {
    onStart(user.userId);
  }, [onStart, user.userId]);

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 p-2 border-b border-default text-sm">
      <span className="w-14 text-dimmed">{user.userId}</span>
      <span className="w-48">{user.userName ?? "(none)"}</span>
      <span className="w-48 font-medium">
        {user.displayName}
        {user.siteAdmin && (
          <span className="ml-2 border border-default bg-accented px-1.5 py-0.5 text-[10px] font-bold tracking-widest text-highlighted">
            SITE ADMIN
          </span>
        )}
      </span>
      <span className="grow flex flex-wrap items-center gap-2">
        {user.siteAdmin ? (
          <span className="text-xs text-dimmed">Protected</span>
        ) : selected ? (
          <>
            <select
              aria-label="Deletion mode"
              className="p-1 bg-default border border-default text-xs"
              value={mode}
              onChange={handleModeChange}
            >
              <option value="ANONYMIZE">
                Anonymize (keep content, hide identity)
              </option>
              <option value="PURGE">
                Purge (delete their posts and polls)
              </option>
            </select>
            <BBButton size="xs" disabled={pending} onClick={handleConfirm}>
              {pending ? "Deleting..." : "Confirm delete"}
            </BBButton>
            <BBButton size="xs" onClick={onCancel}>
              Cancel
            </BBButton>
          </>
        ) : (
          <BBButton size="xs" onClick={handleStart}>
            Delete
          </BBButton>
        )}
      </span>
    </div>
  );
}
