export interface BBWidgetProps {
  widgetTitle?: React.ReactNode;
  className?: string;
  contentContainerClassName?: string;
  children: React.ReactNode;
}

export default function BBWidget({
  widgetTitle,
  className = "",
  contentContainerClassName = "",
  children,
}: BBWidgetProps) {
  return (
    <section
      className={`bb-widget bg-accented border-2 border-default ${className}`}
    >
      {widgetTitle && (
        <h6 className="p-1 m-0 font-bold border-b-2 border-default bg-accented ">
          {widgetTitle}
        </h6>
      )}
      <div className={contentContainerClassName ?? ""}>{children}</div>
    </section>
  );
}
