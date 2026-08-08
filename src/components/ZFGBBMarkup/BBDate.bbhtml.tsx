import type { BBHtmlHandler } from "@/components/ZFGBBMarkup/BBHtml";

const handler: BBHtmlHandler = (element): React.ReactElement | undefined => {
  if (element.name !== "time" || !element.attribs?.["datetime"])
    return undefined;
  const className = element.attribs["class"] ?? "";
  const long = className.split(/\s+/u).includes("bb-date-long");
  return <BBDate dateStr={element.attribs["datetime"]} long={long} />;
};

export default handler;
