import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import AccountDeletionChoice, {
  DELETION_MODE_TITLES,
  type DeletionMode,
} from "@/components/user/account/AccountDeletionChoice";
import { UserContext } from "@/providers/user/userProvider";
import type { AccountDeletionState } from "@/schemas/user";

const DELETION_STATE_QUERY_KEY = ["users-account-deletion-state"];

function deletionErrorMessage(error: unknown, fallback: string) {
  if (getResponseStatus(error) === 429)
    return "Too many attempts. Please wait a while and try again.";
  return fallback;
}

function AccountSummary({
  id,
  displayName,
}: {
  id?: number;
  displayName: string;
}) {
  return (
    <BBWidget widgetTitle="Account Settings">
      <div className="p-4 space-y-2">
        <p>
          Signed in as <span className="font-bold">{displayName}</span>.
        </p>
        <p className="text-sm text-dimmed">
          Profile details can be viewed on{" "}
          <BBLink to={`/user/profile/${id}`}>your profile page</BBLink>.
        </p>
      </div>
    </BBWidget>
  );
}

export default function UserAccountSettingsRoute() {
  const currentUser = useContext(UserContext);
  const queryClient = useQueryClient();
  const loggedIn = Number(currentUser.id) > 0;

  const deletionStateQuery = useQuery({
    queryKey: DELETION_STATE_QUERY_KEY,
    queryFn: async () => {
      const response = await apiFetch(
        `${getApiBaseUrl()}/users/account/delete`,
        { credentials: "include" },
      );
      return handleResponseWithJason(response, AccountDeletionStateSchema);
    },
    enabled: loggedIn,
    retry: 0,
    staleTime: 30_000,
    meta: { userScoped: true },
  });
  const deletionState =
    deletionStateQuery.data && deletionStateQuery.data.status !== "NONE"
      ? deletionStateQuery.data
      : undefined;
  const [stage, setStage] = useState<"choose" | "verify">("choose");
  const [selectedMode, setSelectedMode] = useState<DeletionMode | undefined>();
  const [wipeAcknowledged, setWipeAcknowledged] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [resendNotice, setResendNotice] = useState<string | null>(null);

  const storeDeletionState = (state: AccountDeletionState | undefined) => {
    if (state) queryClient.setQueryData(DELETION_STATE_QUERY_KEY, state);
    else
      void queryClient.invalidateQueries({
        queryKey: DELETION_STATE_QUERY_KEY,
      });
  };

  const previewQuery = useQuery({
    queryKey: ["/users/account/delete/preview"],
    queryFn: async () => {
      const response = await apiFetch(
        `${getApiBaseUrl()}/users/account/delete/preview`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        },
      );
      return handleResponseWithJason(response, AccountDeletionPreviewSchema);
    },
    enabled: loggedIn,
    retry: 0,
    staleTime: 60_000,
    meta: { userScoped: true },
  });
  const preview = previewQuery.data;

  const requestDeletionMutation = useBBMutation({
    request: (values: {
      mode: DeletionMode;
      password: string;
      confirmationPhrase: string;
    }) => ({
      url: "/users/account/delete",
      body: values,
    }),
    schema: AccountDeletionStateSchema,
    onSuccess: (state) => {
      setNotice(null);
      setResendNotice(null);
      storeDeletionState(state);
    },
  });

  const resendMutation = useBBMutation({
    request: () => ({ url: "/users/account/delete/resend" }),
    schema: AccountDeletionStateSchema,
    onSuccess: (state) => {
      storeDeletionState(state);
      setResendNotice("A fresh confirmation email is on its way.");
    },
    onError: (error) => {
      if (getResponseStatus(error) === 404) {
        storeDeletionState(undefined);
        setStage("choose");
        setNotice("There is no pending deletion request anymore.");
        return;
      }
      setResendNotice(
        deletionErrorMessage(
          error,
          "The confirmation email could not be resent right now.",
        ),
      );
    },
  });

  const cancelMutation = useBBMutation({
    request: () => ({ url: "/users/account/delete/cancel" }),
    schema: AccountDeletionStateSchema,
    onSuccess: (state) => {
      if (state.status === "CANCELLED" || state.status === "NONE") {
        storeDeletionState(undefined);
        setStage("choose");
        setSelectedMode(undefined);
        setWipeAcknowledged(false);
        setNotice(
          "Your deletion request has been cancelled. Nothing was changed.",
        );
        return;
      }
      storeDeletionState(state);
    },
  });

  const verifyForm = useForm({
    defaultValues: { password: "", confirmationPhrase: "" },
    validators: {
      onBlur: AccountDeletionVerifyFormSchema,
      onSubmit: AccountDeletionVerifyFormSchema,
    },
    onSubmit: async ({ value }) => {
      if (!selectedMode) return;
      await requestDeletionMutation.mutateAsync({
        mode: selectedMode,
        password: value.password,
        confirmationPhrase: value.confirmationPhrase,
      });
    },
  });

  if (!loggedIn)
    return (
      <BBForbidden
        title="Log in to manage your account settings."
        description="Account settings are only available for your own account."
      />
    );

  const pendingDeletion =
    deletionState?.status === "PENDING" ? deletionState : undefined;
  const deletionUnderway =
    deletionState?.status === "CONFIRMED" ||
    deletionState?.status === "EXECUTING" ||
    deletionState?.status === "COMPLETED";

  const continueDisabled =
    !selectedMode ||
    (selectedMode === "PURGE" && !wipeAcknowledged) ||
    preview?.adminReplacementRequired === true;

  return (
    <div className="space-y-4">
      <AccountSummary
        id={currentUser.id}
        displayName={currentUser.displayName}
      />

      <BBWidget widgetTitle="Delete My Account" className="border-error">
        <div className="p-4 space-y-4">
          {notice && (
            <p
              role="status"
              className="text-sm border-l-2 border-default pl-2 text-success"
            >
              {notice}
            </p>
          )}

          {deletionUnderway && (
            <div className="space-y-2">
              <p className="font-bold text-error">
                This account's deletion has been confirmed and is being carried
                out.
              </p>
              <p className="text-sm text-dimmed">
                This cannot be undone. You will be signed out shortly.
              </p>
            </div>
          )}

          {!deletionUnderway && pendingDeletion && (
            <div className="space-y-3">
              <p className="font-bold">Check your email</p>
              <p className="text-sm">
                We sent a confirmation link to your email address for the option{" "}
                <span className="font-bold">
                  {pendingDeletion.mode
                    ? DELETION_MODE_TITLES[pendingDeletion.mode]
                    : "you chose"}
                </span>
                . Nothing happens to your account until you open that link and
                confirm — it stays fully usable until then.
              </p>
              <p className="text-sm">
                The link is valid until{" "}
                <BBDate dateStr={pendingDeletion.expiresTs} />. If it expires,
                you can start over from this page.
              </p>
              {resendNotice && (
                <p role="status" className="text-sm text-highlighted">
                  {resendNotice}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3">
                <BBButton
                  onClick={() => {
                    setResendNotice(null);
                    resendMutation.mutate();
                  }}
                  disabled={resendMutation.isPending}
                >
                  {resendMutation.isPending
                    ? "Resending…"
                    : "Resend confirmation email"}
                </BBButton>
                <span className="text-xs text-dimmed">
                  {pendingDeletion.resendCount ?? 0} of 3 resends used
                </span>
                <BBButton
                  className="border-error text-error"
                  onClick={() => cancelMutation.mutate()}
                  disabled={cancelMutation.isPending}
                >
                  {cancelMutation.isPending
                    ? "Cancelling…"
                    : "Cancel this deletion request"}
                </BBButton>
              </div>
              <p className="text-xs text-dimmed">
                Didn't request this? Cancel it now and change your password.
              </p>
            </div>
          )}

          <AccountDeletionChoice
            preview={preview}
            selectedMode={selectedMode}
            wipeAcknowledged={wipeAcknowledged}
            continueDisabled={continueDisabled}
            onModeChange={setSelectedMode}
            onWipeAcknowledgedChange={setWipeAcknowledged}
            onContinue={() => setStage("verify")}
          />

          {!deletionUnderway && !pendingDeletion && stage === "verify" && (
            <div className="space-y-4 max-w-md">
              <p className="font-bold">
                {selectedMode ? DELETION_MODE_TITLES[selectedMode] : ""}
              </p>
              <p className="text-sm">
                Confirm it's really you. Nothing is deleted yet — after this
                step we email you a confirmation link, and the deletion only
                happens once you open it.
              </p>
              <BBForm
                form={verifyForm}
                errorMessage={
                  requestDeletionMutation.isError
                    ? deletionErrorMessage(
                        requestDeletionMutation.error,
                        "We couldn't verify your password and username. Check both and try again.",
                      )
                    : null
                }
              >
                <BBField
                  label="Current password:"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                />
                <BBField
                  label="Type your username to confirm:"
                  name="confirmationPhrase"
                  autoComplete="off"
                  helperText="The name you log in with. Capitalization doesn't matter."
                />
                <BBSubmit
                  className="w-full p-2 border-2 border-error text-error bg-muted hover:bg-elevated cursor-pointer disabled:opacity-50"
                  pendingChildren="Sending confirmation email…"
                >
                  Email me the confirmation link
                </BBSubmit>
              </BBForm>
              <BBButton onClick={() => setStage("choose")}>Back</BBButton>
            </div>
          )}
        </div>
      </BBWidget>
    </div>
  );
}
