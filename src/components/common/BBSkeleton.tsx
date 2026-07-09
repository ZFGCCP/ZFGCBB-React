export default function BBSkeleton<
  TProps extends React.HTMLAttributes<HTMLDivElement> & React.PropsWithChildren,
>({ className = "", style, ...rest }: TProps) {
  return (
    <div
      {...rest}
      className={`
        inline-block rounded-lg animate-pulse bg-gradient-to-r from-muted to-elevated
        ${className}
      `}
      style={style}
    />
  );
}
