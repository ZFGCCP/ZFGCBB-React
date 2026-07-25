import type { Node } from "oxc-parser";

export function traverseAST(
  node: unknown,
  onVisit: (node: Node, parent: Node | null) => void,
  parent: Node | null = null,
) {
  if (!node || typeof node !== "object") return;

  if (Array.isArray(node)) {
    for (const item of node) {
      traverseAST(item, onVisit, parent);
    }
    return;
  }

  if ("type" in node && typeof (node as { type?: unknown }).type === "string") {
    // oxlint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    const astNode = node as Node;
    onVisit(astNode, parent);
    for (const value of Object.values(astNode)) {
      traverseAST(value, onVisit, astNode);
    }
  }
}
