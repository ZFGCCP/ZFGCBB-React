export default function SpecialModerationRoute() {
  return (
    <WikiShell trail={specialTrail("Moderation")}>
      <ModerationQueue />
    </WikiShell>
  );
}
