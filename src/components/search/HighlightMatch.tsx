export default function HighlightMatch({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  const matchIndex = query.trim()
    ? text.toLowerCase().indexOf(query.toLowerCase())
    : -1;
  if (matchIndex < 0) return text;
  return (
    <>
      {text.slice(0, matchIndex)}
      <b className="text-highlighted underline decoration-dotted underline-offset-2">
        {text.slice(matchIndex, matchIndex + query.length)}
      </b>
      {text.slice(matchIndex + query.length)}
    </>
  );
}
