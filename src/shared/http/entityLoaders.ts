import type { QueryClient } from "@tanstack/react-query";
import type { GenericSchema } from "valibot";

import { bbQueryOptions } from "@/hooks/query/bbQueryOptions";
import { getQueryClient } from "@/providers/query/queryProvider";
import {
  loadEntity,
  prefetchEntity,
  prefetchQueryDehydrated,
  type EntityLoaderData,
} from "@/shared/http/ssrPrefetch";

type LoaderArgs<TParams> = { request: Request; params: TParams };

type EntityPrefetch<TData> = (
  entity: TData,
  queryClient: QueryClient,
  requestHeaders?: Record<string, string>,
) => Promise<void>;

type DehydratedResult = Awaited<ReturnType<typeof prefetchQueryDehydrated>>;

interface EntityRouteConfig<TParams, TData extends object> {
  url: (params: TParams, request: Request) => `/${string}`;
  schema: GenericSchema<unknown, TData>;
  prefetch?: EntityPrefetch<TData>;
}

interface DehydratedRouteConfig<
  TParams,
  TData extends object,
> extends EntityRouteConfig<TParams, TData> {
  dehydrated: true;
}

export function entityRoute<TParams, TData extends object>(
  config: DehydratedRouteConfig<TParams, TData>,
): {
  loader: (args: LoaderArgs<TParams>) => Promise<DehydratedResult>;
  clientLoader: (args: LoaderArgs<TParams>) => Promise<void>;
};
export function entityRoute<TParams, TData extends object>(
  config: EntityRouteConfig<TParams, TData>,
): {
  loader: (args: LoaderArgs<TParams>) => Promise<EntityLoaderData<TData>>;
  clientLoader: (args: LoaderArgs<TParams>) => Promise<EntityLoaderData<TData>>;
};
export function entityRoute<TParams, TData extends object>(
  config:
    | EntityRouteConfig<TParams, TData>
    | DehydratedRouteConfig<TParams, TData>,
) {
  if ("dehydrated" in config) {
    return {
      loader: ({ request, params }: LoaderArgs<TParams>) => {
        const url = config.url(params, request);
        return prefetchQueryDehydrated(
          request,
          url,
          config.schema,
          async (queryClient, headers) => {
            const entity = queryClient.getQueryData<TData>([url]);
            if (entity && config.prefetch) {
              await config.prefetch(entity, queryClient, headers);
            }
          },
        );
      },
      clientLoader: async ({ request, params }: LoaderArgs<TParams>) => {
        const url = config.url(params, request);
        const queryClient = getQueryClient();
        await queryClient.prefetchQuery(
          bbQueryOptions(url, { schema: config.schema }),
        );
        const entity = queryClient.getQueryData<TData>([url]);
        if (entity && config.prefetch) {
          await config.prefetch(entity, queryClient);
        }
      },
    };
  }

  return {
    loader: ({ request, params }: LoaderArgs<TParams>) =>
      prefetchEntity(
        request,
        config.url(params, request),
        config.schema,
        (entity, queryClient, headers) =>
          config.prefetch
            ? config.prefetch(entity, queryClient, headers)
            : Promise.resolve(),
      ),
    clientLoader: ({ request, params }: LoaderArgs<TParams>) =>
      loadEntity(
        config.url(params, request),
        config.schema,
        (entity, queryClient) =>
          config.prefetch
            ? config.prefetch(entity, queryClient)
            : Promise.resolve(),
      ),
  };
}
