import type { BBHtmlHandler } from "@/components/ZFGBBMarkup/BBHtml";

const handler: BBHtmlHandler = (element) => {
  if (element.name !== "time" || !element.attribs?.["datetime"]) return;
  return <BBDate dateStr={element.attribs["datetime"]} />;
};

export default handler;
