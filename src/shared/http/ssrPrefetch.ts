import {
  QueryClient,
  dehydrate,
  type DehydratedState,
} from "@tanstack/react-query";
import { bbQueryOptions } from "@/hooks/bbQueryOptions";

/**
 * Prefetches a query for SSR with the current request's cookies forwarded so
 * the response reflects the user's auth, then returns a payload suitable for
 * a route loader's return value (consumed by `<HydrationBoundary state=...>`).
 */
export async function prefetchQueryDehydrated<TData extends object>(
  request: Request,
  url: `/${string}` | `/${string}`[],
): Promise<{ dehydratedState: DehydratedState }> {
  const cookie = request.headers.get("Cookie") ?? "";
  const headers = cookie ? { Cookie: cookie } : undefined;
  const queryClient = new QueryClient();
  await Promise.all(
    (Array.isArray(url) ? url : [url]).map((target) =>
      queryClient.prefetchQuery(
        bbQueryOptions<TData>(target, undefined, headers),
      ),
    ),
  );
  return { dehydratedState: dehydrate(queryClient) };
}
