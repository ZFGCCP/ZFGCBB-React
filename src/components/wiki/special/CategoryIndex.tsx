import type { WikiCategoryCount } from "@/types/content";

const CATEGORY_EMPTY_STATE = <BBEmpty message="No categories yet." />;
const isCategoryListEmpty = (categories: WikiCategoryCount[]) =>
  categories.length === 0;
const renderCategories = (categories: WikiCategoryCount[]) => (
  <ul className="md:columns-3 p-4 text-sm [&_li]:break-inside-avoid">
    {categories.map((category) => (
      <li key={category.name}>
        <BBLink
          to={`/wiki/Category:${category.name.replaceAll(" ", "_")}`}
          className="text-highlighted"
        >
          {category.name}
        </BBLink>{" "}
        <span className="text-dimmed">({category.count})</span>
      </li>
    ))}
  </ul>
);

export default function CategoryIndex() {
  const query = useBBQuery("/wiki/meta/categories", {
    schema: WikiCategoryCountListSchema,
  });
  return (
    <BBWidget widgetTitle="Categories">
      <BBQueryBoundary
        query={query}
        isEmpty={isCategoryListEmpty}
        empty={CATEGORY_EMPTY_STATE}
      >
        {renderCategories}
      </BBQueryBoundary>
    </BBWidget>
  );
}
