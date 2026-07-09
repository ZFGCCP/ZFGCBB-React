interface CmsMastheadProps {
  steveId?: number | null;
  title: string;
  stevePadClassName?: string;
  children?: React.ReactNode;
}

export default function CmsMasthead({
  steveId,
  title,
  stevePadClassName = "pt-32 md:pt-48",
  children,
}: CmsMastheadProps) {
  return (
    <header className="relative overflow-hidden border-2 border-b-0 border-default bg-accented">
      {steveId && (
        <>
          <img
            src={contentUrl(steveId)}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-steve-fade" />
        </>
      )}
      <div
        className={`relative px-4 pb-4 ${steveId ? stevePadClassName : "pt-4"}`}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-highlighted text-shadow-steve">
          {title}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
          {children}
        </div>
      </div>
    </header>
  );
}
