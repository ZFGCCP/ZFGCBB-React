import type { Showcase } from "@/types/content";
import type {
  CmsCatalogDescriptor,
  RailSource,
} from "@/types/catalogDescriptor";

function CatalogShowcaseContent<
  TItem extends RailSource,
  TShowcase extends Showcase<TItem>,
  TFacets,
>({
  descriptor,
  showcase,
}: {
  descriptor: CmsCatalogDescriptor<TItem, TShowcase, TFacets>;
  showcase: TShowcase;
}) {
  const carousel = useMemo(
    () => ({
      title: descriptor.carouselTitle,
      viewAllHref: `${descriptor.basePath}/list`,
      viewAllLabel: descriptor.viewAllLabel,
      slides: showcase.recent.map((item) => ({
        key: item.slug,
        content: descriptor.card(item),
      })),
    }),
    [descriptor, showcase.recent],
  );

  return (
    <CmsShowcase
      kicker={descriptor.kicker}
      featured={
        showcase.featured ? descriptor.featured(showcase.featured) : null
      }
      carousel={carousel}
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
  );
}

export default function CmsCatalogShowcase<
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
  const renderShowcase = useCallback(
    (showcase: TShowcase) => (
      <CatalogShowcaseContent descriptor={descriptor} showcase={showcase} />
    ),
    [descriptor],
  );

  return <BBQueryBoundary query={query}>{renderShowcase}</BBQueryBoundary>;
}
