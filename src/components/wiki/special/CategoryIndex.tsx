export default function CategoryIndex() {
  const query = useBBQuery("/wiki/meta/categories", {
    schema: WikiCategoryCountListSchema,
  });
  return (
    <BBWidget widgetTitle="Categories">
      <BBQueryBoundary
        query={query}
        isEmpty={(categories) => !categories.length}
        empty={<BBEmpty message="No categories yet." />}
      >
        {(categories) => (
          <ul className="md:columns-3 p-4 text-sm [&_li]:break-inside-avoid">
            {categories.map((category) => (
              <li key={category.name}>
                <BBLink
                  to={`/wiki/Category:${category.name.replace(/ /g, "_")}`}
                  className="text-highlighted"
                >
                  {category.name}
                </BBLink>{" "}
                <span className="text-dimmed">({category.count})</span>
              </li>
            ))}
          </ul>
        )}
      </BBQueryBoundary>
    </BBWidget>
  );
}
