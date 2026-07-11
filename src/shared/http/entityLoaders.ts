import type { FetchQueryOptions, QueryClient } from "@tanstack/react-query";
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

type DependentQueries = readonly FetchQueryOptions<any, any, any, any>[];

type EntityPrefetch<TData> = (
  entity: TData,
  requestHeaders?: Record<string, string>,
  queryClient?: QueryClient,
) => DependentQueries | Promise<DependentQueries>;

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

async function warmDependents(
  queryClient: QueryClient,
  dependents: DependentQueries | Promise<DependentQueries>,
) {
  const resolved = await dependents;
  if (resolved.length === 0) return;
  await Promise.all(
    resolved.map((options) => queryClient.prefetchQuery(options)),
  );
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
              await warmDependents(
                queryClient,
                config.prefetch(entity, headers, queryClient),
              );
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
          await warmDependents(
            queryClient,
            config.prefetch(entity, undefined, queryClient),
          );
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
            ? warmDependents(queryClient, config.prefetch(entity, headers))
            : Promise.resolve(),
      ),
    clientLoader: ({ request, params }: LoaderArgs<TParams>) =>
      loadEntity(
        config.url(params, request),
        config.schema,
        (entity, queryClient) =>
          config.prefetch
            ? warmDependents(queryClient, config.prefetch(entity))
            : Promise.resolve(),
      ),
  };
}
