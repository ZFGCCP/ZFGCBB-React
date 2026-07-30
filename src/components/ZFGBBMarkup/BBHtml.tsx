import parse, {
  Comment,
  domToReact,
  Element,
  ProcessingInstruction,
  Text,
  type DOMNode,
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
  .toSorted(([left], [right]) => left.localeCompare(right))
  .map(([, module]) => module.default);

function isDOMNode(node: Element["children"][number]): node is DOMNode {
  return (
    node instanceof Comment ||
    node instanceof Element ||
    node instanceof ProcessingInstruction ||
    node instanceof Text
  );
}

const PARSE_OPTIONS: HTMLReactParserOptions = {
  replace(node) {
    if (!(node instanceof Element)) return undefined;
    const element = node;
    const renderChildren = () =>
      domToReact(element.children.filter(isDOMNode), PARSE_OPTIONS);
    for (const handler of HANDLERS) {
      const result = handler(element, { renderChildren });
      if (result !== undefined) return result;
    }
    return undefined;
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
