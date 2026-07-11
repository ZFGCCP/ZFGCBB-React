import parse, {
  domToReact,
  type DOMNode,
  type Element,
  type HTMLReactParserOptions,
} from "html-react-parser/lib/index";

export interface BBHtmlContext {
  renderChildren: () => React.ReactNode;
}

export type BBHtmlHandler = (
  element: Element,
  context: BBHtmlContext,
) => React.ReactElement | undefined;

const HANDLERS = Object.entries(
  import.meta.glob<{ default: BBHtmlHandler }>(
    "/src/components/ZFGBBMarkup/**/*.bbhtml.tsx",
    { eager: true },
  ),
)
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([, module]) => module.default);

const PARSE_OPTIONS: HTMLReactParserOptions = {
  replace(node) {
    if (node.type !== "tag") return;
    const element = node as Element;
    const renderChildren = () =>
      domToReact((element.children as DOMNode[]) ?? [], PARSE_OPTIONS);
    for (const handler of HANDLERS) {
      const result = handler(element, { renderChildren });
      if (result !== undefined) return result;
    }
  },
};

interface BBHtmlProps {
  html: string;
  className?: string;
}

function BBHtml({ html, className }: BBHtmlProps) {
  const nodes = useMemo(() => parse(html, PARSE_OPTIONS), [html]);
  return <div className={className}>{nodes}</div>;
}

export default memo(BBHtml);
