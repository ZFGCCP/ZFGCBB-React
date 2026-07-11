export default function WikiRefLabel({
  namespace,
  title,
}: {
  namespace: string;
  title: string;
}) {
  return (
    <>
      {namespace !== "MAIN" && (
        <span className="text-dimmed">{namespace}:</span>
      )}
      {title}
    </>
  );
}
