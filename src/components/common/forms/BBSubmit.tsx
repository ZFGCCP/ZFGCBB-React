import { useSelector } from "@tanstack/react-form";
import { useBBFormContext } from "./BBForm";

type BBSubmitProps = {
  children: React.ReactNode;
  pendingChildren?: React.ReactNode | undefined;
  /** Forces the button to disabled regardless of form state (e.g., outer mutation pending). */
  disabled?: boolean | undefined;
  className?: string | undefined;
};

export default function BBSubmit({
  children,
  pendingChildren,
  disabled,
  className,
}: BBSubmitProps) {
  const form = useBBFormContext();
  const isSubmitting = useSelector(form.store, (state) => state.isSubmitting);

  const buttonDisabled = (disabled ?? false) || isSubmitting;

  return (
    <button
      type="submit"
      disabled={buttonDisabled}
      className={
        className ??
        "w-full p-2 bg-accented border border-default disabled:opacity-50"
      }
    >
      {isSubmitting ? (pendingChildren ?? children) : children}
    </button>
  );
}
