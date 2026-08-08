type BBSkeletonProps = React.HTMLAttributes<HTMLDivElement> &
  React.PropsWithChildren;

export default function BBSkeleton({
  className = "",
  style,
  ...rest
}: BBSkeletonProps) {
  return (
    <div
      {...rest}
      className={`
        inline-block rounded-lg animate-pulse bg-linear-to-r from-muted to-elevated
        ${className}
      `}
      style={style}
    />
  );
}
