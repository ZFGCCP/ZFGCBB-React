import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { QueryKey, UseMutationOptions } from "@tanstack/react-query";
import * as v from "valibot";

type BBMutationRequest = {
  url: string;
  body?: unknown;
  method?: string;
  headers?: Record<string, string>;
};

type UseBBMutationOptions<TSchema extends v.GenericSchema, TVariables> = Omit<
  UseMutationOptions<v.InferOutput<TSchema>, Error, TVariables>,
  "mutationFn"
> & {
  request: (variables: TVariables) => BBMutationRequest;
  schema?: TSchema;
  invalidateKeys?: QueryKey[];
};

export const useBBMutation = <
  TVariables = void,
  TSchema extends v.GenericSchema = v.GenericSchema<unknown, unknown>,
>({
  request,
  schema,
  invalidateKeys,
  onSuccess,
  ...options
}: UseBBMutationOptions<TSchema, TVariables>) => {
  const queryClient = useQueryClient();
  return useMutation<v.InferOutput<TSchema>, Error, TVariables>({
    ...options,
    onSuccess: (...args) => {
      for (const queryKey of invalidateKeys ?? []) {
        void queryClient.invalidateQueries({ queryKey });
      }
      return onSuccess?.(...args);
    },
    mutationFn: async (variables) => {
      const { url, body, method = "POST", headers } = request(variables);
      const hasBody =
        method !== "GET" && method !== "DELETE" && body !== undefined;
      const response = await apiFetch(`${getApiBaseUrl()}${url}`, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json", ...headers },
        ...(hasBody ? { body: JSON.stringify(body) } : {}),
      });
      return handleResponseWithJason(response, schema);
    },
  });
};
