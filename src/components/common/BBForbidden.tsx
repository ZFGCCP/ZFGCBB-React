export interface BBForbiddenProps {
  title?: string;
  description?: string;
}

export default function BBForbidden({
  title = "You don't have permission to view this page. YOU SHALL NAHT PASS!",
  description = "If you think this is a mistake, try logging in or returning to the forum index.",
}: BBForbiddenProps) {
  return (
    <BBWidget widgetTitle="Forbidden">
      <div className="p-4 space-y-3">
        <p className="font-bold">{title}</p>
        <p className="text-sm text-dimmed">{description}</p>
        <div className="flex gap-3 pt-1">
          <BBLink to="/">Back to forum</BBLink>
          <BBLink to="/user/auth/login">Log in</BBLink>
        </div>
      </div>
    </BBWidget>
  );
}
