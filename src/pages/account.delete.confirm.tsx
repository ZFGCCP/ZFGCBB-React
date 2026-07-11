import {
  clearExpectedSession,
  getQueryClient,
} from "@/providers/query/queryProvider";

function teardownDeletedSession() {
  clearExpectedSession();
  getQueryClient().clear();
}

function readTokenFromUrlFragment(hash: string): string {
  const fragment = hash.startsWith("#") ? hash.slice(1) : hash;
  return new URLSearchParams(fragment).get("token") ?? "";
}

export default function AccountDeleteConfirmRoute() {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const token = readTokenFromUrlFragment(hash);

  const confirmMutation = useBBMutation({
    request: () => ({
      url: "/users/account/delete/confirm",
      body: { token },
    }),
    schema: AccountDeletionStateSchema,
    onSuccess: () => {
      teardownDeletedSession();
      void navigate("/account/deleted", { replace: true });
    },
    onError: (error) => {
      if (getResponseStatus(error) !== 401) return;
      teardownDeletedSession();
      void navigate("/account/deleted", { replace: true });
    },
  });

  const errorStatus = confirmMutation.isError
    ? getResponseStatus(confirmMutation.error)
    : undefined;
  const showInvalidLink = confirmMutation.isError && errorStatus !== 429;

  return (
    <BBWidget widgetTitle="Confirm Account Deletion">
      <meta name="referrer" content="no-referrer" />
      <div className="p-4 space-y-4 max-w-xl">
        {!token && (
          <>
            <p className="font-bold">This confirmation link is incomplete.</p>
            <p className="text-sm text-dimmed">
              Please open the link from your confirmation email again, or
              request a new one from your account settings.
            </p>
            <BBLink to="/user/settings/account">Go to account settings</BBLink>
          </>
        )}

        {token && !showInvalidLink && (
          <>
            <p className="font-bold text-error">
              You are about to permanently delete your account.
            </p>
            <p className="text-sm">
              Your confirmation email says which option you chose: either{" "}
              <span className="font-bold">
                permanently deleting your posts, uploads, wiki pages you
                created, and your projects and resources
              </span>
              , or{" "}
              <span className="font-bold">
                keeping everything you wrote with your name shown as [deleted]
              </span>
              . Either way, your identity, email address, and personal
              information are erased.
            </p>
            <p className="text-sm">
              Quotes of your posts inside other members' messages are not
              rewritten, and private messages you sent stay in recipients'
              inboxes with your name removed.
            </p>
            <p className="text-sm font-bold">
              This cannot be undone. There is no grace period and no way to
              recover the account afterwards.
            </p>
            <p className="text-sm text-dimmed">
              Changed your mind? Just close this page — nothing happens until
              you press the button below. You can also cancel the request from
              your account settings.
            </p>
            <BBButton
              variant="destructive"
              className="w-full"
              disabled={confirmMutation.isPending}
              onClick={() => confirmMutation.mutate()}
            >
              {confirmMutation.isPending
                ? "Deleting your account…"
                : "Permanently delete my account"}
            </BBButton>
            {confirmMutation.isPending && (
              <p role="status" className="text-sm text-dimmed">
                Deleting your account. This may take a moment — please leave
                this page open.
              </p>
            )}
            {errorStatus === 429 && (
              <p role="alert" className="text-sm text-highlighted">
                Too many attempts. Please wait a minute, then press the button
                again.
              </p>
            )}
          </>
        )}

        {token && showInvalidLink && (
          <>
            <p className="font-bold">This confirmation link did not work.</p>
            <p className="text-sm text-dimmed">
              It may have expired, been replaced by a newer email, or been
              cancelled — or the connection may have dropped mid-request. If the
              deletion already went through, trying again will simply complete
              it.
            </p>
            <div className="flex items-center gap-3">
              <BBButton
                onClick={() => confirmMutation.mutate()}
                disabled={confirmMutation.isPending}
              >
                Try again
              </BBButton>
              <BBLink to="/user/settings/account">
                Go to account settings
              </BBLink>
            </div>
          </>
        )}
      </div>
    </BBWidget>
  );
}
