const BUTTON_SIZES = {
  sm: "px-3 py-1 text-sm",
  xs: "px-2 py-0.5 text-xs",
};

type BBButtonProps = React.ComponentProps<"button"> & {
  size?: keyof typeof BUTTON_SIZES;
};

export default function BBButton({
  size = "sm",
  type = "button",
  className,
  ...rest
}: BBButtonProps) {
  return (
    <button
      type={type}
      className={`border-2 border-default bg-muted hover:bg-elevated cursor-pointer disabled:opacity-50 ${BUTTON_SIZES[size]}${className ? ` ${className}` : ""}`}
      {...rest}
    />
  );
}
