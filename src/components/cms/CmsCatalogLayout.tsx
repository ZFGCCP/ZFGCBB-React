import type { Showcase } from "@/types/content";
import type {
  CmsCatalogDescriptor,
  RailSource,
} from "@/types/catalogDescriptor";

export default function CmsCatalogLayout<
  TItem extends RailSource,
  TShowcase extends Showcase<TItem>,
  TFacets,
>({
  descriptor,
}: {
  descriptor: CmsCatalogDescriptor<TItem, TShowcase, TFacets>;
}) {
  const query = useBBQuery(`${descriptor.api}/showcase`, {
    schema: descriptor.showcaseSchema,
  });
  const label = descriptor.crumb.toLowerCase();
  const headingId = `${label}-heading`;

  return (
    <section aria-labelledby={headingId}>
      <header className="border-2 border-b-0 border-default bg-accented">
        <div className="flex items-baseline gap-3 px-4 pb-2 pt-3">
          <span aria-hidden className="h-8 w-2 self-center bg-hatch" />
          <h1
            id={headingId}
            className="text-2xl font-bold tracking-[0.2em] text-highlighted"
          >
            {descriptor.heading}
          </h1>
          {query.data && (
            <span className="ml-auto self-center text-xs text-dimmed">
              {descriptor.total(query.data).toLocaleString()} {label}
            </span>
          )}
        </div>
      </header>

      <Outlet />
    </section>
  );
}
