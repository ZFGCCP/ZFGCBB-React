import parse, {
  attributesToProps,
  domToReact,
  type DOMNode,
  type HTMLReactParserOptions,
} from "html-react-parser/lib/index";
import { getPublicApiBaseUrl } from "@/shared/http/api";
import type { RoutePaths } from "@/components/common/BBLink";

const PARSE_OPTIONS: HTMLReactParserOptions = {
  replace(node) {
    const element = node;
    if (element.type !== "tag") return;

    if (element.name === "img") {
      const src = element.attribs?.["src"];
      if (src?.startsWith("/content/")) {
        const normalized = src.replace(/^\/content\/image\//, "/content/");
        const { className, ...imgProps } = attributesToProps(
          element.attribs ?? {},
        );
        return (
          <img
            alt=""
            {...imgProps}
            src={`${getPublicApiBaseUrl()}${normalized}`}
            className={["max-w-full", className].filter(Boolean).join(" ")}
          />
        );
      }
      return;
    }

    if (element.name !== "a") return;
    const ass = element.attribs?.["class"] ?? "";
    if (!ass.split(/\s+/).includes("bb-resource-link")) return;
    const href = element.attribs?.["href"];
    if (!href) return;

    return (
      <BBLink to={href as RoutePaths} className={ass}>
        {domToReact((element.children as DOMNode[]) ?? [], PARSE_OPTIONS)}
      </BBLink>
    );
  },
};

interface BBHtmlProps {
  html: string;
  className?: string;
}

export default function BBHtml({ html, className }: BBHtmlProps) {
  return <div className={className}>{parse(html, PARSE_OPTIONS)}</div>;
}
