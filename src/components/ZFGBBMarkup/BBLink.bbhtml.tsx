import type { BBHtmlHandler } from "@/components/ZFGBBMarkup/BBHtml";

const handler: BBHtmlHandler = (element, { renderChildren }) => {
  if (element.name !== "a") return undefined;
  const className = element.attribs?.["class"] ?? "";
  if (!className.split(/\s+/).includes("bb-resource-link")) return undefined;
  const href = element.attribs?.["href"];
  if (!href) return undefined;
  return (
    <BBLink to={href} className={className}>
      {renderChildren()}
    </BBLink>
  );
};

export default handler;
