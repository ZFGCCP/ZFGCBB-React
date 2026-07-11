export default function UserLink({
  userId,
  name,
  className = "text-highlighted",
  fallbackClassName,
}: {
  userId?: number | null;
  name: string;
  className?: string;
  fallbackClassName?: string;
}) {
  if (userId == null) {
    return <span className={fallbackClassName}>{name}</span>;
  }
  return (
    <BBLink to={`/user/profile/${userId}`} className={className}>
      {name}
    </BBLink>
  );
}
