import type { BBHtmlHandler } from "@/components/ZFGBBMarkup/BBHtml";

const handler: BBHtmlHandler = (element, { renderChildren }) => {
  if (element.name !== "div") return undefined;
  const classes = (element.attribs?.["class"] ?? "").split(/\s+/);
  if (!classes.includes("bb-code-widget")) return undefined;
  return (
    <BBWidget
      widgetTitle={element.attribs?.["data-widget-title"]}
      className="my-2"
    >
      {renderChildren()}
    </BBWidget>
  );
};

export default handler;
