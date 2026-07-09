import {
  QueryClient,
  dehydrate,
  type DehydratedState,
} from "@tanstack/react-query";
import * as v from "valibot";

/**
 * Prefetches a query for SSR with the current request's cookies forwarded so
 * the response reflects the user's auth, then returns a payload suitable for
 * a route loader's return value (consumed by `<HydrationBoundary state=...>`).
 */
export type PrefetchTarget = {
  url: `/${string}`;
  schema?: v.GenericSchema<unknown, object>;
};

export async function prefetchQueryDehydrated<TData extends object = object>(
  request: Request,
  target: `/${string}` | PrefetchTarget[],
  schema?: v.GenericSchema<unknown, TData>,
): Promise<{ dehydratedState: DehydratedState }> {
  const cookie = request.headers.get("Cookie") ?? "";
  const headers = cookie ? { Cookie: cookie } : undefined;
  const queryClient = new QueryClient();
  const targets: PrefetchTarget[] = Array.isArray(target)
    ? target
    : [{ url: target, schema }];
  await Promise.all(
    targets.map((entry) =>
      queryClient.prefetchQuery(
        bbQueryOptions(entry.url, { schema: entry.schema }, headers),
      ),
    ),
  );
  return { dehydratedState: dehydrate(queryClient) };
}
