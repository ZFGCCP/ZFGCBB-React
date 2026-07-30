export interface AdminCardProps {
  title: string;
  description: string;
  to: string;
  available?: boolean;
}

export function AdminCard({
  title,
  description,
  to,
  available = true,
}: AdminCardProps) {
  return (
    <section className="bg-accented border-2 border-default flex flex-col">
      <h6 className="p-1 font-bold border-b-2 border-default bg-accented">
        {title}
      </h6>
      <div className="p-4 flex flex-col gap-3 grow">
        <p className="text-sm text-dimmed grow">{description}</p>
        {available ? (
          <BBLink to={to} className="text-sm text-highlighted">
            Manage <Fa6SolidArrowRight aria-hidden className="inline" />
          </BBLink>
        ) : (
          <span className="text-sm text-dimmed">Coming soon</span>
        )}
      </div>
    </section>
  );
}
