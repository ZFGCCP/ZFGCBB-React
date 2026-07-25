import {
  QueryClient,
  dehydrate,
  type DehydratedState,
} from "@tanstack/react-query";
import type * as v from "valibot";
import { getQueryClient } from "@/providers/query/queryProvider";

export type PrefetchTarget = {
  url: `/${string}`;
  schema?: v.GenericSchema<unknown, object>;
  meta?: Record<string, unknown>;
};

export type EntityLoaderData<TData> = {
  dehydratedState?: DehydratedState;
  entity: TData;
};

const ACCESS_COOKIE_NAME = "zfgbb_access_token";

function forwardedHeaders(
  request: Request,
): Record<string, string> | undefined {
  const cookie = request.headers.get("Cookie") ?? "";
  return cookie ? { Cookie: cookie } : undefined;
}

export function requestIsAuthenticated(request: Request): boolean {
  const cookie = request.headers.get("Cookie");
  if (!cookie) return false;
  for (const part of cookie.split(";")) {
    const separator = part.indexOf("=");
    if (separator === -1) continue;
    if (part.slice(0, separator).trim() !== ACCESS_COOKIE_NAME) continue;
    return part.slice(separator + 1).trim().length > 0;
  }
  return false;
}

export async function prefetchQueries(
  request: Request,
  targets: readonly PrefetchTarget[],
): Promise<{ dehydratedState: DehydratedState; queryClient: QueryClient }> {
  const headers = forwardedHeaders(request);
  const queryClient = new QueryClient();
  await Promise.all(
    targets.map((entry) =>
      queryClient.prefetchQuery(
        bbQueryOptions(
          entry.url,
          { schema: entry.schema, meta: entry.meta },
          headers,
        ),
      ),
    ),
  );
  return { dehydratedState: dehydrate(queryClient), queryClient };
}

export async function prefetchQueryDehydrated<TData extends object = object>(
  request: Request,
  target: `/${string}` | PrefetchTarget[],
  schema?: v.GenericSchema<unknown, TData>,
  extra?: (
    queryClient: QueryClient,
    requestHeaders?: Record<string, string>,
  ) => Promise<void>,
): Promise<{ dehydratedState: DehydratedState }> {
  const targets = Array.isArray(target) ? target : [{ url: target, schema }];
  const { dehydratedState, queryClient } = await prefetchQueries(
    request,
    targets,
  );
  if (!extra) return { dehydratedState };
  await extra(queryClient, forwardedHeaders(request));
  return { dehydratedState: dehydrate(queryClient) };
}

export async function prefetchEntity<TData extends object>(
  request: Request,
  url: `/${string}`,
  schema: v.GenericSchema<unknown, TData>,
  extra?: (
    entity: TData,
    queryClient: QueryClient,
    requestHeaders?: Record<string, string>,
  ) => Promise<void>,
): Promise<EntityLoaderData<TData>> {
  const requestHeaders = forwardedHeaders(request);
  const queryClient = new QueryClient();
  const entity = await queryClient.fetchQuery(
    bbQueryOptions(url, { schema }, requestHeaders),
  );
  if (extra) await extra(entity, queryClient, requestHeaders);
  return { dehydratedState: dehydrate(queryClient), entity };
}

export async function loadEntity<TData extends object>(
  url: `/${string}`,
  schema: v.GenericSchema<unknown, TData>,
  extra?: (entity: TData, queryClient: QueryClient) => Promise<unknown>,
): Promise<EntityLoaderData<TData>> {
  const queryClient = getQueryClient();
  const entity = await queryClient.ensureQueryData({
    ...bbQueryOptions(url, { schema }),
    revalidateIfStale: true,
  });
  if (extra) await extra(entity, queryClient);
  return { entity };
}
