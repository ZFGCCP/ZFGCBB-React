import type { ElementType } from "react";

const JUSTIFY_CLASSES = {
  start: "justify-start",
  end: "justify-end",
  center: "justify-center",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

const ALIGN_CLASSES = {
  start: "items-start",
  end: "items-end",
  center: "items-center",
  baseline: "items-baseline",
  stretch: "items-stretch",
};

export interface BBFlexProps {
  children: React.ReactNode;
  className?: string | undefined;
  direction?: "row" | "col" | undefined;
  justify?:
    | "start"
    | "end"
    | "center"
    | "between"
    | "around"
    | "evenly"
    | undefined;
  align?: "start" | "end" | "center" | "baseline" | "stretch" | undefined;
  wrap?: boolean | undefined;
  gap?: string | undefined;
  as?: ElementType | undefined;
}

export default function BBFlex({
  children,
  className = "",
  direction = "row",
  justify = "start",
  align = "start",
  wrap = false,
  gap = "",
}: BBFlexProps) {
  const flexDirection = direction === "col" ? "flex-col" : "flex-row";
  const justifyContent = JUSTIFY_CLASSES[justify];
  const alignItems = ALIGN_CLASSES[align];
  const flexWrap = wrap ? "flex-wrap" : "flex-nowrap";

  return (
    <div
      className={`flex ${flexDirection} ${justifyContent} ${alignItems} ${flexWrap} ${gap} ${className}`}
    >
      {children}
    </div>
  );
}
