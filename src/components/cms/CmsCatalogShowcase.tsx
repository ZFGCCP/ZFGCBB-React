import type { Showcase } from "@/types/content";
import type {
  CmsCatalogDescriptor,
  RailSource,
} from "@/types/catalogDescriptor";

export function CmsCatalogShowcase<
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

  return (
    <BBQueryBoundary query={query}>
      {(showcase) => (
        <CmsShowcase
          kicker={descriptor.kicker}
          featured={
            showcase.featured ? descriptor.featured(showcase.featured) : null
          }
          carousel={{
            title: descriptor.carouselTitle,
            viewAllHref: `${descriptor.basePath}/list`,
            viewAllLabel: descriptor.viewAllLabel,
            slides: showcase.recent.map((item) => ({
              key: item.slug,
              content: descriptor.card(item),
            })),
          }}
          random={toRailItems(
            showcase.random,
            descriptor.basePath,
            descriptor.randomSub,
          )}
          topRated={toRailItems(
            showcase.topRated,
            descriptor.basePath,
            descriptor.topRatedSub,
          )}
          mostDownloaded={toRailItems(
            showcase.mostDownloaded,
            descriptor.basePath,
            descriptor.downloadsSub,
          )}
        />
      )}
    </BBQueryBoundary>
  );
}
