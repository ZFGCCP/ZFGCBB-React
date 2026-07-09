import type { Showcase } from "@/types/content";
import type {
  CmsCatalogDescriptor,
  RailSource,
} from "@/components/cms/catalogDescriptor";

export function CmsCatalogLayout<
  TItem extends RailSource,
  TShowcase extends Showcase<TItem>,
  TFacets,
>({
  descriptor,
}: {
  descriptor: CmsCatalogDescriptor<TItem, TShowcase, TFacets>;
}) {
  const { data: showcase } = useBBQuery<TShowcase>(
    `${descriptor.api}/showcase`,
  );
  const headingId = `${descriptor.crumb.toLowerCase()}-heading`;
  const label = descriptor.crumb.toLowerCase();
  const crumbs = [{ label: "Home", to: "/" }, { label: descriptor.crumb }];

  return (
    <section aria-labelledby={headingId}>
      <BBBreadcrumb crumbs={crumbs} />
      <header className="border-2 border-b-0 border-default bg-accented">
        <div className="flex items-baseline gap-3 px-4 pb-2 pt-3">
          <span aria-hidden className="h-8 w-2 self-center bg-hatch" />
          <h1
            id={headingId}
            className="text-2xl font-bold tracking-[0.2em] text-highlighted"
          >
            {descriptor.heading}
          </h1>
          {showcase && (
            <span className="ml-auto self-center text-xs text-dimmed">
              {descriptor.total(showcase).toLocaleString()} {label}
            </span>
          )}
        </div>
      </header>

      <Outlet />

      <BBBreadcrumb crumbs={crumbs} />
    </section>
  );
}
