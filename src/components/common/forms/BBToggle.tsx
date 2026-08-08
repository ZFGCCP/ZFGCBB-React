type BBToggleProps = Omit<
  React.ComponentProps<"input">,
  "checked" | "children" | "className" | "onChange" | "type"
> & {
  checked: boolean;
  children: React.ReactNode;
  className?: string;
  onCheckedChange: (checked: boolean) => void;
};

export default function BBToggle({
  checked,
  children,
  className,
  onCheckedChange,
  ...inputProps
}: BBToggleProps) {
  const change = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange(event.target.checked);
    },
    [onCheckedChange],
  );

  return (
    <label
      className={`inline-flex cursor-pointer items-center gap-1 rounded border px-2 py-0.5 text-xs ${
        checked
          ? "border-highlighted bg-accented text-highlighted"
          : "border-default hover:bg-muted"
      }${className ? ` ${className}` : ""}`}
    >
      <input
        {...inputProps}
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={change}
      />
      {children}
    </label>
  );
}
