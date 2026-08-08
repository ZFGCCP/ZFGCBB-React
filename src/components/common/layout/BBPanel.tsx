type BBPanelProps<TElement extends React.ElementType> = {
  as?: TElement;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<TElement>, "as" | "className">;

export default function BBPanel<TElement extends React.ElementType = "div">({
  as,
  className,
  ...rest
}: BBPanelProps<TElement>) {
  const Tag = as ?? "div";
  return (
    <Tag
      className={`border-2 border-default bg-muted${className ? ` ${className}` : ""}`}
      {...rest}
    />
  );
}
