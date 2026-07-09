import { queryOptions } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";

export const bbQueryOptions = <TData extends object>(
  url: `/${string}`,
  options?: Omit<UseQueryOptions<TData>, "queryKey" | "queryFn">,
  requestHeaders?: Record<string, string>,
) =>
  queryOptions<TData>({
    queryKey: [url],
    queryFn: () =>
      fetch(`${getApiBaseUrl()}${url}`, {
        credentials: import.meta.env.SSR ? "omit" : "include",
        headers: {
          "Content-Type": "application/json",
          ...requestHeaders,
        },
      }).then((response) => handleResponseWithJason<TData>(response)),
    staleTime: 100_000,
    gcTime: 300_000,
    ...options,
  });
