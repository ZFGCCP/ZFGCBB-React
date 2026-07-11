import type { BBHtmlHandler } from "@/components/ZFGBBMarkup/BBHtml";

const handler: BBHtmlHandler = (element, { renderChildren }) => {
  if (element.name !== "div") return;
  const classes = (element.attribs?.["class"] ?? "").split(/\s+/);
  if (!classes.includes("bb-code-widget")) return;
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
