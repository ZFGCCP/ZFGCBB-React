import { attributesToProps } from "html-react-parser/lib/index";
import type { BBHtmlHandler } from "@/components/ZFGBBMarkup/BBHtml";

const handler: BBHtmlHandler = (element) => {
  if (element.name !== "img") return undefined;
  const rawSrc = element.attribs?.["src"];
  if (!rawSrc) return undefined;
  const src = rawSrc.startsWith("/content/")
    ? `${getPublicApiBaseUrl()}${rawSrc}`
    : rawSrc;
  const {
    className,
    src: _src,
    crossOrigin: _crossOrigin,
    ...rest
  } = attributesToProps(element.attribs ?? {});
  const classes = typeof className === "string" ? className.split(/\s+/) : [];
  const framed = classes.includes("bb-code-preview");
  return (
    <BBImage
      {...rest}
      dynamicSrc={src}
      alt={typeof rest.alt === "string" ? rest.alt : ""}
      crossOrigin={undefined}
      className={[
        "max-w-full",
        framed && "block w-full border-2 border-default",
        ...classes.filter((token) => token !== "bb-code-preview"),
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
};

export default handler;
