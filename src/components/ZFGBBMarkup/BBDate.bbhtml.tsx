import type { BBHtmlHandler } from "@/components/ZFGBBMarkup/BBHtml";

const handler: BBHtmlHandler = (element): React.ReactElement | undefined => {
  if (element.name !== "time" || !element.attribs?.["datetime"])
    return undefined;
  return <BBDate dateStr={element.attribs["datetime"]} />;
};

export default handler;
