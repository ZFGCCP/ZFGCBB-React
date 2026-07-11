import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { Navigate } from "react-router";

export default function SystemInstall() {
  const { data: status, isLoading } = useBBQuery("/system/install/status", {
    schema: InstallStatusResponseSchema,
  });

  const queryClient = useQueryClient();

  const installMutation = useBBMutation({
    request: ({ installToken, applySampleData, ...body }: InstallForm) => ({
      url: "/system/install",
      body: { ...body, contentPack: applySampleData ? "zfgc" : undefined },
      headers: { "X-Install-Token": installToken },
    }),
    schema: InstallResponseSchema,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["/system/install/status"],
      });
      void queryClient.invalidateQueries({ queryKey: ["/users/loggedInUser"] });
    },
  });

  const form = useForm({
    defaultValues: {
      installToken: "",
      adminUserName: "",
      adminDisplayName: "",
      adminEmail: "",
      adminPassword: "",
      siteName: "ZFGBB",
      applySampleData: false,
      provisionRecycleBin: true,
    } as InstallForm,
    validators: {
      onBlur: InstallFormSchema,
      onSubmit: InstallFormSchema,
    },
    onSubmit: async ({ value }) => {
      await installMutation.mutateAsync(value);
    },
  });

  if (isLoading) {
    return (
      <BBWidget widgetTitle="Setup">
        <div className="p-4">
          <p>Loading...</p>
        </div>
      </BBWidget>
    );
  }

  if (installMutation.isSuccess && installMutation.data) {
    return (
      <div className="space-y-4">
        <BBWidget widgetTitle="Setup Complete">
          <div className="p-4 space-y-2">
            <p>
              Installation complete! Welcome to {installMutation.data.siteName}.
            </p>
            <p>
              Admin account created (user ID: {installMutation.data.adminUserId}
              ).
            </p>
            {installMutation.data.contentPack && (
              <p>
                The {installMutation.data.contentPack} content pack has been
                applied.
              </p>
            )}
            <BBLink to="/">Go to home</BBLink>
          </div>
        </BBWidget>

        <BBWidget widgetTitle="Migrate from an Existing Forum?">
          <div className="p-4 space-y-3">
            <p>
              If you have an existing forum you'd like to import, you can set up
              a migration now. The following platforms are supported:
            </p>
            <div className="flex items-center justify-between p-2 border border-default">
              <span>SMF 2.0.x</span>
              <BBLink to="/system/migrate">Set up migration</BBLink>
            </div>
          </div>
        </BBWidget>
      </div>
    );
  }

  if (status?.installed) {
    return <Navigate to="/" replace />;
  }

  return (
    <BBWidget widgetTitle="Forum Setup">
      <div className="p-4 space-y-4">
        <BBForm
          form={form}
          errorMessage={
            installMutation.isError
              ? "Installation failed. Check your install token and try again."
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
          <BBCheckboxField name="applySampleData" label="Apply sample data" />
          <BBCheckboxField
            name="provisionRecycleBin"
            label="Recycle bin for deleted posts"
            helperText="Deleted posts move to a hidden staff-only board where moderators can restore them. When disabled, deleting a post removes it permanently."
          />
          <BBSubmit pendingChildren="Installing...">Install</BBSubmit>
        </BBForm>
      </div>
    </BBWidget>
  );
}
