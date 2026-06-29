export function RatingBadge({
  rating,
  voteCount,
}: {
  rating: number;
  voteCount: number;
}) {
  return (
    <BBPanel as="span" className="px-2 py-0.5 text-xs">
      <Fa6SolidStar aria-hidden className="inline" /> {rating.toFixed(1)}{" "}
      <span className="text-dimmed">({voteCount} votes)</span>
    </BBPanel>
  );
}
