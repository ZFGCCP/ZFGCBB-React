import { useState } from "react";

type DeletionMode = "ANONYMIZE" | "PURGE";

function UserManagement() {
  const usersQuery = useBBQuery("/system/users", {
    schema: UserSummaryListSchema,
    queryKey: "admin-users",
  });
  const [pendingUserId, setPendingUserId] = useState<number | null>(null);
  const [mode, setMode] = useState<DeletionMode>("ANONYMIZE");

  const deleteUser = useBBMutation({
    request: (variables: { userId: number; mode: DeletionMode }) => ({
      url: "/system/users/delete",
      method: "POST",
      body: variables,
    }),
    invalidateKeys: [["admin-users"]],
    onSuccess: () => setPendingUserId(null),
  });

  return (
    <BBWidget widgetTitle="User Management">
      <BBQueryBoundary
        query={usersQuery}
        isEmpty={(users) => users.length === 0}
        empty={<BBEmpty message="No users found." />}
      >
        {(users) => (
          <div>
            <div className="flex flex-wrap gap-x-4 p-2 border-b-2 border-default text-sm font-semibold">
              <span className="w-14">ID</span>
              <span className="w-48">Username</span>
              <span className="w-48">Display name</span>
              <span className="grow">Actions</span>
            </div>
            {users.map((user) => (
              <div
                key={user.userId}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 p-2 border-b border-default text-sm"
              >
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
                  ) : pendingUserId === user.userId ? (
                    <>
                      <select
                        aria-label="Deletion mode"
                        className="p-1 bg-default border border-default text-xs"
                        value={mode}
                        onChange={(event) =>
                          setMode(event.target.value as DeletionMode)
                        }
                      >
                        <option value="ANONYMIZE">
                          Anonymize (keep content, hide identity)
                        </option>
                        <option value="PURGE">
                          Purge (delete their posts and polls)
                        </option>
                      </select>
                      <BBButton
                        size="xs"
                        disabled={deleteUser.isPending}
                        onClick={() =>
                          deleteUser.mutate({ userId: user.userId, mode })
                        }
                      >
                        {deleteUser.isPending
                          ? "Deleting..."
                          : "Confirm delete"}
                      </BBButton>
                      <BBButton
                        size="xs"
                        onClick={() => setPendingUserId(null)}
                      >
                        Cancel
                      </BBButton>
                    </>
                  ) : (
                    <BBButton
                      size="xs"
                      onClick={() => {
                        setMode("ANONYMIZE");
                        setPendingUserId(user.userId);
                      }}
                    >
                      Delete
                    </BBButton>
                  )}
                </span>
              </div>
            ))}
            {deleteUser.isError && (
              <p className="p-2 text-xs text-error">
                {(deleteUser.error as Error)?.message}
              </p>
            )}
          </div>
        )}
      </BBQueryBoundary>
    </BBWidget>
  );
}

export default function AdminUsersPage() {
  return (
    <BBHasPermission requiredPermissions={["ZFGC_SITE_ADMIN"]}>
      <UserManagement />
    </BBHasPermission>
  );
}
