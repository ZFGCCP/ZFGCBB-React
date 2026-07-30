import { useState } from "react";
import * as v from "valibot";
import {
  type DeletionMode,
  type UserSummary,
  UserManagementRow,
} from "./UserManagementRow";

const USERS_EMPTY_STATE = <BBEmpty message="No users found." />;
const isUserListEmpty = (users: UserSummary[]) => users.length === 0;

export function UserManagement() {
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
    onSuccess: () => {
      setPendingUserId(null);
    },
  });
  const handleConfirm = useCallback(
    (userId: number) => {
      deleteUser.mutate({ userId, mode });
    },
    [deleteUser, mode],
  );
  const handleCancel = useCallback(() => {
    setPendingUserId(null);
  }, []);
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
