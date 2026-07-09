import { queryOptions } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import * as v from "valibot";

export type BBQueryOptions<TData> = Omit<
  UseQueryOptions<TData>,
  "queryKey" | "queryFn"
> & {
  schema?: v.GenericSchema<unknown, TData>;
};

export const bbQueryOptions = <TData extends object>(
  url: `/${string}`,
  options?: BBQueryOptions<TData>,
  requestHeaders?: Record<string, string>,
) => {
  const { schema, ...queryOpts } = options ?? {};
  return queryOptions<TData>({
    queryKey: [url],
    queryFn: async () => {
      const response = await fetch(`${getApiBaseUrl()}${url}`, {
        credentials: import.meta.env.SSR ? "omit" : "include",
        headers: {
          "Content-Type": "application/json",
          ...requestHeaders,
        },
      });
      return handleResponseWithJason(response, schema);
    },
    staleTime: 100_000,
    gcTime: 300_000,
    ...queryOpts,
  });
};
