import type { UseQueryResult } from "@tanstack/react-query";

export interface BBQueryBoundaryProps<TData> {
  query: UseQueryResult<TData>;
  children: (data: TData) => React.ReactNode;
  loading?: React.ReactNode;
  empty?: React.ReactNode;
  isEmpty?: (data: TData) => boolean;
}

export default function BBQueryBoundary<TData>({
  query,
  children,
  loading,
  empty,
  isEmpty,
}: BBQueryBoundaryProps<TData>) {
  const retry = useCallback(() => {
    void query.refetch();
  }, [query]);

  if (query.data !== undefined) {
    if (isEmpty?.(query.data)) return empty ?? <BBEmpty />;
    return children(query.data);
  }
  if (query.isError)
    return <BBError error={query.error ?? undefined} onRetry={retry} />;
  return loading ?? <BBSkeleton className="h-40 w-full rounded" />;
}
