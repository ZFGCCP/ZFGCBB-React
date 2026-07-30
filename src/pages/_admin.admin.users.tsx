import { useState } from "react";
import * as v from "valibot";

type DeletionMode = "ANONYMIZE" | "PURGE";
type UserSummary = v.InferOutput<typeof UserSummarySchema>;

const ADMIN_PERMISSION = ["ZFGC_SITE_ADMIN"] as const;
const USERS_EMPTY_STATE = <BBEmpty message="No users found." />;
const isUserListEmpty = (users: UserSummary[]) => users.length === 0;

function isDeletionMode(value: string): value is DeletionMode {
  return value === "ANONYMIZE" || value === "PURGE";
}

function UserManagementRow({
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
  const handleConfirm = useCallback(
    () => onConfirm(user.userId),
    [onConfirm, user.userId],
  );
  const handleStart = useCallback(
    () => onStart(user.userId),
    [onStart, user.userId],
  );

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

function UserManagement() {
  const usersQuery = useBBQuery("/system/users", {
    schema: UserSummaryListSchema,
    queryKey: "admin-users",
  });
  const [pendingUserId, setPendingUserId] = useState<number | null>(null);
  const [mode, setMode] = useState<DeletionMode>("ANONYMIZE");

  const deleteUser = useBBMutation({
    schema: v.undefined(),
    request: (variables: { userId: number; mode: DeletionMode }) => ({
      url: "/system/users/delete",
      method: "POST",
      body: variables,
    }),
    invalidateKeys: [["admin-users"]],
    onSuccess: () => setPendingUserId(null),
  });
  const handleConfirm = useCallback(
    (userId: number) => deleteUser.mutate({ userId, mode }),
    [deleteUser, mode],
  );
  const handleCancel = useCallback(() => setPendingUserId(null), []);
  const handleStart = useCallback((userId: number) => {
    setMode("ANONYMIZE");
    setPendingUserId(userId);
  }, []);
  const renderUsers = useCallback(
    (users: UserSummary[]) => (
      <div>
        <div className="flex flex-wrap gap-x-4 p-2 border-b-2 border-default text-sm font-semibold">
          <span className="w-14">ID</span>
          <span className="w-48">Username</span>
          <span className="w-48">Display name</span>
          <span className="grow">Actions</span>
        </div>
        {users.map((user) => (
          <UserManagementRow
            key={user.userId}
            user={user}
            selected={pendingUserId === user.userId}
            mode={mode}
            pending={deleteUser.isPending}
            onModeChange={setMode}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            onStart={handleStart}
          />
        ))}
        {deleteUser.isError && (
          <p className="p-2 text-xs text-error">{deleteUser.error?.message}</p>
        )}
      </div>
    ),
    [
      deleteUser.error?.message,
      deleteUser.isError,
      deleteUser.isPending,
      handleCancel,
      handleConfirm,
      handleStart,
      mode,
      pendingUserId,
    ],
  );

  return (
    <BBWidget widgetTitle="User Management">
      <BBQueryBoundary
        query={usersQuery}
        isEmpty={isUserListEmpty}
        empty={USERS_EMPTY_STATE}
      >
        {renderUsers}
      </BBQueryBoundary>
    </BBWidget>
  );
}

export default function AdminUsersPage() {
  return (
    <BBHasPermission requiredPermissions={ADMIN_PERMISSION}>
      <UserManagement />
    </BBHasPermission>
  );
}
