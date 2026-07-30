import { useForm } from "@tanstack/react-form";
import {
  clearPrivateQueryState,
  getQueryClient,
  recordSessionEstablished,
} from "@/providers/query/queryProvider";

const LOGIN_DEFAULT_VALUES: LoginForm = {
  username: "",
  password: "",
  stayLoggedIn: true,
};

function postInstallAdminUserName(value: unknown): string | undefined {
  if (
    typeof value !== "object" ||
    value === null ||
    !("installationComplete" in value) ||
    value.installationComplete !== true ||
    !("returnTo" in value) ||
    value.returnTo !== "/system/migrate" ||
    !("adminUserName" in value) ||
    typeof value.adminUserName !== "string"
  ) {
    return undefined;
  }
  return value.adminUserName;
}

export default function UserLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const adminUserName = postInstallAdminUserName(location.state);
  const continueToMigrator = adminUserName !== undefined;

  const loginMutation = useBBMutation({
    request: (values: LoginForm) => ({
      url: "/users/auth/login",
      body: {
        username: values.username,
        password: values.password,
        stayLoggedIn: values.stayLoggedIn,
        grant_type: "password",
        scope: "all",
      },
    }),
    schema: LoginResponseSchema,
    onSuccess: async (loginResponse) => {
      await clearPrivateQueryState();
      recordSessionEstablished(loginResponse.accessTokenTtlSeconds);
      getQueryClient().setQueryData(
        ["/users/loggedInUser"],
        loginResponse.user,
      );
      await navigate(continueToMigrator ? "/system/migrate" : "/", {
        replace: true,
      });
    },
  });

  const form = useForm({
    defaultValues: {
      ...LOGIN_DEFAULT_VALUES,
      username: adminUserName ?? "",
    },
    validators: {
      onBlur: LoginFormSchema,
      onSubmit: LoginFormSchema,
    },
    onSubmit: async ({ value }) => {
      await loginMutation.mutateAsync(value);
    },
  });

  return (
    <BBWidget widgetTitle="Login">
      <div className="p-4 space-y-4 max-w-sm mx-auto">
        {continueToMigrator && (
          <p className="border-l-2 border-highlighted pl-3">
            Installation is complete. Log in as <strong>{adminUserName}</strong>{" "}
            to continue to the SMF Migrator.
          </p>
        )}
        <BBForm
          form={form}
          errorMessage={
            loginMutation.isError ? "Invalid username or password." : null
          }
        >
          <BBField label="Username:" name="username" autoComplete="username" />
          <BBField
            label="Password:"
            name="password"
            type="password"
            autoComplete="current-password"
          />
          <BBCheckboxField name="stayLoggedIn" label="Always stay logged in" />
          <BBSubmit pendingChildren="Logging in...">Login</BBSubmit>
        </BBForm>
        <div className="text-sm text-dimmed space-y-1 pt-1 border-t border-default">
          <p>
            Don't have an account?{" "}
            <BBLink to="/user/auth/registration">Register</BBLink>
          </p>
          <p>
            <BBLink to="/">Forgot your password?</BBLink>
          </p>
        </div>
      </div>
    </BBWidget>
  );
}
