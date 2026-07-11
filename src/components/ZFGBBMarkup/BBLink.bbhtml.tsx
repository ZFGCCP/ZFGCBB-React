import type { RoutePaths } from "@/components/common/BBLink";
import type { BBHtmlHandler } from "@/components/ZFGBBMarkup/BBHtml";

const handler: BBHtmlHandler = (element, { renderChildren }) => {
  if (element.name !== "a") return;
  const className = element.attribs?.["class"] ?? "";
  if (!className.split(/\s+/).includes("bb-resource-link")) return;
  const href = element.attribs?.["href"];
  if (!href) return;
  return (
    <BBLink to={href as RoutePaths} className={className}>
      {renderChildren()}
    </BBLink>
  );
};

export default handler;
