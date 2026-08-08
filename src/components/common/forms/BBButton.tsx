const BUTTON_SIZES = {
  sm: "px-3 py-1 text-sm",
  xs: "px-2 py-0.5 text-xs",
};

const BUTTON_VARIANTS = {
  default: "border-default bg-muted hover:bg-elevated",
  destructive: "border-error text-error bg-muted hover:bg-elevated",
};

type BBButtonProps = React.ComponentProps<"button"> & {
  size?: keyof typeof BUTTON_SIZES;
  variant?: keyof typeof BUTTON_VARIANTS;
};

export default function BBButton({
  size = "sm",
  variant = "default",
  type = "button",
  className,
  ...rest
}: BBButtonProps) {
  return (
    <button
      type={type}
      className={`border-2 cursor-pointer disabled:opacity-50 ${BUTTON_VARIANTS[variant]} ${BUTTON_SIZES[size]}${className ? ` ${className}` : ""}`}
      {...rest}
    />
  );
}
