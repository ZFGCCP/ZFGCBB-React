export default function UserLink({
  userId,
  name,
  className = "text-highlighted",
  fallbackClassName,
}: {
  userId?: number | null | undefined;
  name: string;
  className?: string | undefined;
  fallbackClassName?: string | undefined;
}) {
  if (userId === null || userId === undefined) {
    return <span className={fallbackClassName}>{name}</span>;
  }
  return (
    <BBLink to={`/user/profile/${userId}`} className={className}>
      {name}
    </BBLink>
  );
}
