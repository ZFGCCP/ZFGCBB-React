import { firstError } from "./utils";

import { useField } from "@tanstack/react-form";
import { useBBFormContext } from "./BBForm";

export type BBSelectOption = {
  value: string;
  label: string;
};

type BBSelectFieldProps = {
  name: string;
  label: string;
  options: BBSelectOption[];
  helperText?: string;
  disabled?: boolean;
};

export default function BBSelectField({
  name,
  label,
  options,
  helperText,
  disabled,
}: BBSelectFieldProps) {
  const form = useBBFormContext();
  const field = useField({ form, name });
  const error = firstError(field.state.meta.errors);
  const showError = field.state.meta.isTouched && !!error;

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-muted">
        {label}
      </label>
      <BBSelect
        id={name}
        name={name}
        disabled={disabled}
        className={showError ? "border-highlighted" : undefined}
        value={String(field.state.value ?? "")}
        onChange={(event) => field.handleChange(event.target.value)}
        onBlur={field.handleBlur}
        options={options}
      />
      {showError ? (
        <p className="text-xs text-highlighted">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-dimmed">{helperText}</p>
      ) : null}
    </div>
  );
}
