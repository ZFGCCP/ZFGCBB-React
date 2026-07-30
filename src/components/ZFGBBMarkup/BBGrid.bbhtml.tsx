import type { BBHtmlHandler } from "@/components/ZFGBBMarkup/BBHtml";

const GRID_COLUMNS = {
  "bb-grid-1": "1",
  "bb-grid-2": "1 lg:grid-cols-2",
  "bb-grid-3": "1 md:grid-cols-2 lg:grid-cols-3",
} as const;

const handler: BBHtmlHandler = (element, { renderChildren }) => {
  if (element.name !== "div") return undefined;
  const classes = (element.attribs?.["class"] ?? "").split(/\s+/);
  if (!classes.includes("bb-code-grid")) return undefined;
  const columnToken = classes.find(
    (token): token is keyof typeof GRID_COLUMNS => token in GRID_COLUMNS,
  );
  return (
    <BBGrid columns={GRID_COLUMNS[columnToken ?? "bb-grid-1"]} className="my-2">
      {renderChildren()}
    </BBGrid>
  );
};

export default handler;
