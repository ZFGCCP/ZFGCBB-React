import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";

export default function UserLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
    schema: UserSchema,
    onSuccess: () => {
      queryClient.invalidateQueries();
      navigate("/");
    },
  });

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
      stayLoggedIn: false,
    } as LoginForm,
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
