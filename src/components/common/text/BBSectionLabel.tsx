const LABEL_SIZES = {
  xs: "text-xs",
  "2xs": "text-[10px]",
};

type BBSectionLabelProps = {
  as?: React.ElementType;
  size?: keyof typeof LABEL_SIZES;
  className?: string;
  children: React.ReactNode;
};

export default function BBSectionLabel({
  as: Tag = "span",
  size = "xs",
  className,
  children,
}: BBSectionLabelProps) {
  return (
    <Tag
      className={`font-bold uppercase tracking-[0.2em] text-highlighted ${LABEL_SIZES[size]}${className ? ` ${className}` : ""}`}
    >
      {children}
    </Tag>
  );
}
