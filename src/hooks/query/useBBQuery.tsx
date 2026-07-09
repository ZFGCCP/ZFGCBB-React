import {
  useQuery,
  type QueryKey,
  type UseQueryOptions,
} from "@tanstack/react-query";
import * as v from "valibot";

export type UseBBQueryOptions<TSchema extends v.GenericSchema> = Omit<
  UseQueryOptions<
    v.InferOutput<TSchema>,
    Error,
    v.InferOutput<TSchema>,
    QueryKey
  >,
  "queryKey" | "queryFn"
> & {
  queryKey?: string;
  schema?: TSchema;
};

export const useBBQuery = <
  TSchema extends v.GenericSchema = v.GenericSchema<unknown, unknown>,
>(
  url: `/${string}`,
  options: UseBBQueryOptions<TSchema> = {},
) => {
  const {
    queryKey,
    schema,
    retry = 0,
    gcTime = 300000,
    staleTime = 100000,
    enabled = true,
    throwOnError = (error: Error) => getResponseStatus(error) === 403,
    ...rest
  } = options;

  return useQuery<
    v.InferOutput<TSchema>,
    Error,
    v.InferOutput<TSchema>,
    QueryKey
  >({
    queryKey: [queryKey ?? url],
    queryFn: async () => {
      const response = await fetch(`${getApiBaseUrl()}${url ?? "/"}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return handleResponseWithJason(response, schema);
    },
    retry,
    gcTime,
    staleTime,
    enabled,
    throwOnError,
    ...rest,
  });
};
