import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { Navigate } from "react-router";
import {
  clearExpectedSession,
  clearPrivateQueryState,
} from "@/providers/query/queryProvider";

const POST_INSTALL_LOGIN_STATE = { installationComplete: true } as const;

const CONTENT_FORMAT_OPTIONS = ContentFormatSchema.options.map(
  (contentFormat) => ({
    value: contentFormat,
    label: contentFormatLabel(contentFormat),
  }),
);

const INSTALL_FORM_DEFAULTS: InstallForm = {
  installToken: "",
  adminUserName: "",
  adminDisplayName: "",
  adminEmail: "",
  adminPassword: "",
  siteName: "ZFGBB",
  defaultContentFormat: "BBCODE",
  installSampleData: false,
  provisionRecycleBin: true,
};

function installErrorMessage(error: unknown) {
  const status = getResponseStatus(error);
  if (status === undefined) {
    return "The backend could not be reached. Check that the API is running and that the frontend proxy is configured.";
  }
  if (status === 502 || status === 503 || status === 504) {
    return `The setup API is temporarily unavailable through the proxy (HTTP ${status}). Check the backend service and try again.`;
  }
  if (status === 404) {
    return "Install is unavailable. The token may be missing, or the site is already installed.";
  }
  if (status === 409) {
    return withSafeDetail("An install is already in progress.", error);
  }
  if (status === 400 || status === 422) {
    return withSafeDetail("The backend rejected these settings.", error);
  }
  if (status >= 500) {
    return `The backend failed while installing the site (HTTP ${status}). Check the server logs, correct the failure, and retry the same request.`;
  }
  return `Installation failed (HTTP ${status}). Review the request and try again.`;
}

function statusErrorMessage(error: unknown) {
  const status = getResponseStatus(error);
  if (status === undefined) {
    return "The backend could not be reached.";
  }
  if (status === 502 || status === 503 || status === 504) {
    return `The setup API is unavailable through the proxy (HTTP ${status}). Setup is hidden until the backend is reachable.`;
  }
  if (status === 404) {
    return "The backend didn't answer the install status check. The frontend and backend versions may not match.";
  }
  return `Installation status could not be verified (HTTP ${status}). Setup is hidden to prevent an unsafe duplicate installation attempt.`;
}

export default function SystemInstall() {
  const navigate = useNavigate();
  const statusQuery = useBBQuery("/system/install/status", {
    schema: InstallStatusResponseSchema,
    staleTime: 0,
    refetchOnMount: "always",
  });
  const handleRetryStatus = useCallback(
    () => void statusQuery.refetch(),
    [statusQuery],
  );

  const queryClient = useQueryClient();

  const installMutation = useBBMutation({
    request: ({ installToken, ...body }: InstallForm) => ({
      url: "/system/install",
      body,
      headers: { "X-Install-Token": installToken },
    }),
    schema: InstallResponseSchema,
  });

  const form = useForm({
    defaultValues: INSTALL_FORM_DEFAULTS,
    validators: {
      onBlur: InstallFormSchema,
      onSubmit: InstallFormSchema,
    },
    onSubmit: async ({ value }) => {
      const response = await installMutation.mutateAsync(value);
      clearExpectedSession();
      await clearPrivateQueryState();
      queryClient.setQueryData(["/system/install/status"], {
        installed: true,
        siteName: response.siteName,
      });
      form.reset();
      await navigate("/user/auth/login", {
        replace: true,
        state: {
          ...POST_INSTALL_LOGIN_STATE,
          adminUserName: value.adminUserName,
        },
      });
    },
  });

  if (
    !installMutation.isSuccess &&
    (statusQuery.isLoading || statusQuery.isFetching)
  ) {
    return (
      <BBWidget widgetTitle="Setup">
        <div className="p-4">
          <p>Loading...</p>
        </div>
      </BBWidget>
    );
  }

  if (statusQuery.isError) {
    return (
      <BBWidget widgetTitle="Setup Unavailable">
        <div className="p-4 space-y-3">
          <p className="text-error">{statusErrorMessage(statusQuery.error)}</p>
          <BBButton
            disabled={statusQuery.isFetching}
            onClick={handleRetryStatus}
          >
            {statusQuery.isFetching ? "Checking..." : "Retry status check"}
          </BBButton>
        </div>
      </BBWidget>
    );
  }

  if (!installMutation.isSuccess && statusQuery.data?.installed) {
    return <Navigate to="/" replace />;
  }

  return (
    <BBWidget widgetTitle="Forum Setup">
      <div className="p-4 space-y-4">
        <BBForm
          form={form}
          errorMessage={
            installMutation.isError
              ? installErrorMessage(installMutation.error)
              : null
          }
        >
          <BBField label="Install Token" name="installToken" type="password" />
          <BBField label="Admin Username" name="adminUserName" />
          <BBField label="Admin Display Name" name="adminDisplayName" />
          <BBField label="Admin Email" name="adminEmail" type="email" />
          <BBField
            label="Admin Password"
            name="adminPassword"
            type="password"
          />
          <BBField label="Site Name" name="siteName" />
          <BBSelectField
            name="defaultContentFormat"
            label="Default Content Format"
            options={CONTENT_FORMAT_OPTIONS}
            helperText="What new posts and wiki pages start in. Authors can switch per post."
          />
          <BBCheckboxField
            name="installSampleData"
            label="Install sample data"
            helperText="Fills the site with example boards, posts, wiki pages and projects."
          />
          <BBCheckboxField
            name="provisionRecycleBin"
            label="Recycle bin for deleted posts"
            helperText="Deleted posts go to a staff-only board instead of being erased."
          />
          <BBSubmit pendingChildren="Installing...">Install</BBSubmit>
        </BBForm>
      </div>
    </BBWidget>
  );
}
