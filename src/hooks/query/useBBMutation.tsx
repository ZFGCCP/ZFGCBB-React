import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
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
};

export const useBBMutation = <
  TVariables = void,
  TSchema extends v.GenericSchema = v.GenericSchema<unknown, unknown>,
>({
  request,
  schema,
  ...options
}: UseBBMutationOptions<TSchema, TVariables>) =>
  useMutation<v.InferOutput<TSchema>, Error, TVariables>({
    ...options,
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
