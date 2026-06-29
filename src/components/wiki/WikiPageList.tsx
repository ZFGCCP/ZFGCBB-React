import type { WikiPageRef } from "@/types/content";

export function WikiRefLabel({
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

export function WikiPageList({
  refs,
  className,
}: {
  refs: WikiPageRef[];
  className?: string;
}) {
  return (
    <ul
      className={`md:columns-3 text-sm [&_li]:break-inside-avoid${className ? ` ${className}` : ""}`}
    >
      {refs.map((pageRef) => (
        <li key={pageRef.slug}>
          <BBLink to={wikiRefPath(pageRef)} className="text-highlighted">
            <WikiRefLabel namespace={pageRef.namespace} title={pageRef.title} />
          </BBLink>
        </li>
      ))}
    </ul>
  );
}
