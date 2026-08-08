export default function WikiTimeline({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ol className="ml-1 border-l-2 border-default/40 pl-4">{children}</ol>;
}
