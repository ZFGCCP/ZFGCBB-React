import type { CarouselSlide, FeaturedItem, RailItem } from "./ShowcasePieces";

const RANDOM_GLYPH = <BBIcon name="nav" />;
const TOP_RATED_GLYPH = <Fa6SolidStar className="text-sm" />;
const MOST_DOWNLOADED_GLYPH = <BBIcon name="sort-down" />;

export function CmsShowcase({
  featured,
  kicker,
  carousel,
  random,
  topRated,
  mostDownloaded,
}: {
  featured: FeaturedItem | null;
  kicker: string;
  carousel: {
    title: string;
    viewAllHref: string;
    viewAllLabel?: string;
    slides: CarouselSlide[];
  };
  random: RailItem[];
  topRated: RailItem[];
  mostDownloaded: RailItem[];
}) {
  return (
    <div className="space-y-3 border-2 border-t-0 border-default bg-default p-3">
      {featured && <FeaturedPanel item={featured} kicker={kicker} />}
      {carousel.slides.length > 0 && <ShowcaseCarousel {...carousel} />}
      <div className="grid gap-3 lg:grid-cols-3">
        <HighlightRail title="Random" glyph={RANDOM_GLYPH} items={random} />
        <HighlightRail
          title="Top Rated"
          glyph={TOP_RATED_GLYPH}
          items={topRated}
        />
        <HighlightRail
          title="Most Downloaded"
          glyph={MOST_DOWNLOADED_GLYPH}
          items={mostDownloaded}
        />
      </div>
    </div>
  );
}
