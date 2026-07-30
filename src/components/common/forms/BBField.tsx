import { useField } from "@tanstack/react-form";
import { useBBFormContext } from "./BBForm";
import BBInput from "./BBInput";

type BBFieldProps = {
  name: string;
  label: string;
  type?: React.HTMLInputTypeAttribute;
  helperText?: string;
  autoComplete?: string;
  placeholder?: string;
};

export default function BBField({
  name,
  label,
  type = "text",
  helperText,
  autoComplete,
  placeholder,
}: BBFieldProps) {
  const form = useBBFormContext();
  const field = useField({ form, name });
  const error = firstError(field.state.meta.errors);
  const showError = field.state.meta.isTouched && !!error;
  const fieldValue = field.state.value;
  const value =
    typeof fieldValue === "string" || typeof fieldValue === "number"
      ? fieldValue
      : "";
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      field.handleChange(event.target.value),
    [field],
  );

  return (
    <BBInput
      label={label}
      name={name}
      type={type}
      autoComplete={autoComplete}
      placeholder={placeholder}
      helperText={helperText}
      error={showError ? error : undefined}
      value={value}
      onChange={handleChange}
      onBlur={field.handleBlur}
    />
  );
}
