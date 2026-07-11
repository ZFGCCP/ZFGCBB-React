export default function CmsDetailShell({
  entityPath,
  children,
}: {
  entityPath: `/${string}`;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      {children}
      <EntityDiscussion entityPath={entityPath} />
    </div>
  );
}
