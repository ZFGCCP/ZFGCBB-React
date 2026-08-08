export interface BBEmptyProps {
  message?: string;
  children?: React.ReactNode;
}

export default function BBEmpty({
  message = "Nothing here yet.",
  children,
}: BBEmptyProps) {
  return (
    <div className="flex flex-col items-center gap-3 p-8 text-center">
      <span className="h-8 w-2 bg-hatch" aria-hidden />
      <span className="text-sm text-dimmed">{message}</span>
      {children}
    </div>
  );
}
