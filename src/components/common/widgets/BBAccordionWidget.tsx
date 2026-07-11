export interface BBAccordionProps {
  title: string;
  children: React.ReactNode;
  startExpanded?: boolean;
}

export default function BBAccordion({
  title,
  children,
  startExpanded,
}: BBAccordionProps) {
  const [expanded, setExpanded] = useState(startExpanded ?? false);

  return (
    <div className="m-8">
      <div className="bg-default border-2 border-default p-3">
        <h5 className="align-items-center">
          <button
            type="button"
            className="cursor-pointer w-full text-left align-items-center"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
          >
            <span className="inline-block">
              {expanded ? <Fa6SolidSquareMinus /> : <Fa6SolidSquarePlus />}
            </span>
            <span className="inline-block mx-3">{title}</span>
          </button>
        </h5>
      </div>
      {expanded && <div className="m-2">{children}</div>}
    </div>
  );
}
