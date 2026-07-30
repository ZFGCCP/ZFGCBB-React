import type { AnyFormApi } from "@tanstack/react-form";

const BBFormContext = createContext<AnyFormApi | null>(null);

export function useBBFormContext(): AnyFormApi {
  const formContext = use(BBFormContext);
  if (!formContext) {
    throw new Error(
      "BB form components must be rendered inside a <BBForm> with a `form` prop.",
    );
  }
  return formContext;
}

type BBFormProps = {
  form?: AnyFormApi;
  children: React.ReactNode;
  errorMessage?: string | null;
  className?: string;
  role?: React.AriaRole;
  onSubmit?: React.SubmitEventHandler<HTMLFormElement>;
};

export default function BBForm({
  form,
  children,
  errorMessage,
  className,
  role,
  onSubmit,
}: BBFormProps) {
  const handleSubmit = useCallback(
    (event: React.SubmitEvent<HTMLFormElement>) => {
      if (form) {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
        return;
      }
      onSubmit?.(event);
    },
    [form, onSubmit],
  );
  const formElement = (
    <form
      className={className ?? "space-y-3"}
      role={role ?? "form"}
      noValidate
      onSubmit={handleSubmit}
    >
      {errorMessage && (
        <div
          role="alert"
          className="text-highlighted text-sm border-l-2 border-highlighted pl-2"
        >
          {errorMessage}
        </div>
      )}
      {children}
    </form>
  );

  if (!form) {
    return formElement;
  }

  return (
    <BBFormContext.Provider value={form}>{formElement}</BBFormContext.Provider>
  );
}
