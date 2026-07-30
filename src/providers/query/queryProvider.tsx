import {
  defaultShouldDehydrateQuery,
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
  type Query,
} from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { getErrorResponse } from "@/shared/http/response.handler";

const SESSION_EXPIRY_STORAGE_KEY = "zfgbb-session-expires-at";
const PROACTIVE_REFRESH_LEAD_MS = 120_000;
const AUTH_ENDPOINT_PATHS = [
  "/users/auth/login",
  "/users/auth/refresh",
  "/users/auth/logout",
];

let refreshMarkedStale = false;
let inFlightRefresh: Promise<boolean> | undefined;
let proactiveRefreshTimer: ReturnType<typeof setTimeout> | undefined;

function readSessionExpiresAt() {
  if (import.meta.env.SSR) return undefined;
  const stored = window.localStorage.getItem(SESSION_EXPIRY_STORAGE_KEY);
  if (!stored) return undefined;
  const parsed = Number(stored);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function recordSessionEstablished(accessTokenTtlSeconds: number) {
  if (import.meta.env.SSR) return;
  const expiresAt = currentEpochMilliseconds() + accessTokenTtlSeconds * 1000;
  window.localStorage.setItem(SESSION_EXPIRY_STORAGE_KEY, String(expiresAt));
  refreshMarkedStale = false;
  scheduleProactiveRefresh();
}

export function clearExpectedSession() {
  if (import.meta.env.SSR) return;
  window.localStorage.removeItem(SESSION_EXPIRY_STORAGE_KEY);
  clearProactiveRefreshTimer();
}

export async function clearPrivateQueryState() {
  queryClient.clear();
  await getPersister()?.removeClient();
}

function scheduleProactiveRefresh() {
  clearProactiveRefreshTimer();
  const expiresAt = readSessionExpiresAt();
  if (expiresAt === undefined) return;
  const delay = Math.max(
    expiresAt - PROACTIVE_REFRESH_LEAD_MS - currentEpochMilliseconds(),
    0,
  );
  proactiveRefreshTimer = setTimeout(onProactiveRefreshDue, delay);
}

function clearProactiveRefreshTimer() {
  if (proactiveRefreshTimer) clearTimeout(proactiveRefreshTimer);
  proactiveRefreshTimer = undefined;
}

function onProactiveRefreshDue() {
  proactiveRefreshTimer = undefined;
  const expiresAt = readSessionExpiresAt();
  if (expiresAt === undefined) return;
  if (currentEpochMilliseconds() < expiresAt - PROACTIVE_REFRESH_LEAD_MS) {
    scheduleProactiveRefresh();
    return;
  }
  void refreshExpectedSession();
}

export function refreshExpectedSession(): Promise<boolean> {
  if (readSessionExpiresAt() === undefined) return Promise.resolve(false);
  refreshMarkedStale = false;
  return tryRefresh();
}

async function performRefresh() {
  try {
    const response = await apiFetch(`${getApiBaseUrl()}/users/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) {
      refreshMarkedStale = true;
      if (response.status === 401 || response.status === 403) {
        clearExpectedSession();
        await clearPrivateQueryState();
      }
      return false;
    }
    const { accessTokenTtlSeconds } = await handleResponseWithJason(
      response,
      RefreshResponseSchema,
    );
    recordSessionEstablished(accessTokenTtlSeconds);
    await queryClient.invalidateQueries();
    return true;
  } catch {
    refreshMarkedStale = true;
    return false;
  }
}

function tryRefresh(): Promise<boolean> {
  if (import.meta.env.SSR || refreshMarkedStale) return Promise.resolve(false);
  inFlightRefresh ??= performRefresh().finally(() => {
    inFlightRefresh = undefined;
  });
  return inFlightRefresh;
}

function errorIsFromAuthEndpoint(error: unknown) {
  const url = getErrorResponse(error)?.url ?? "";

  return AUTH_ENDPOINT_PATHS.some((path) => url.includes(path));
}

function onQueryError(error: unknown, query: Query<unknown, unknown>) {
  if (getResponseStatus(error) !== 401) return;
  if (errorIsFromAuthEndpoint(error)) return;
  void tryRefresh().then((refreshed) => {
    if (refreshed)
      void queryClient.refetchQueries({
        queryKey: query.queryKey,
        exact: true,
      });
  });
}

function onMutationError(error: unknown) {
  if (getResponseStatus(error) !== 401) return;
  if (errorIsFromAuthEndpoint(error)) return;
  void tryRefresh();
}

function clearStaleRefresh() {
  refreshMarkedStale = false;
}

const PERSIST_MAX_AGE = 1000 * 60 * 60 * 24;

const makeQueryClient = () =>
  new QueryClient({
    queryCache: new QueryCache({
      onError: onQueryError,
      onSuccess: clearStaleRefresh,
    }),
    mutationCache: new MutationCache({
      onError: onMutationError,
      onSuccess: clearStaleRefresh,
    }),
    defaultOptions: { queries: { gcTime: PERSIST_MAX_AGE } },
  });

const queryClient = makeQueryClient();

export const getQueryClient = () => queryClient;

let browserPersister: ReturnType<typeof createAsyncStoragePersister>;

function getPersister() {
  if (import.meta.env.SSR || import.meta.env.DEV) return undefined;
  browserPersister ??= createAsyncStoragePersister({
    storage: window.localStorage,
    key: "zfgbb-query-cache",
  });
  return browserPersister;
}

export default function QueryProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [client] = useState(() =>
    import.meta.env.SSR ? makeQueryClient() : queryClient,
  );
  const [persister] = useState(getPersister);
  const persistOptions = useMemo(
    () => ({
      persister: persister!,
      maxAge: PERSIST_MAX_AGE,
      buster: "zfgbb-v2-private-by-default",
      dehydrateOptions: {
        shouldDehydrateQuery: (
          query: Parameters<typeof defaultShouldDehydrateQuery>[0],
        ) => defaultShouldDehydrateQuery(query) && query.meta?.persist === true,
      },
    }),
    [persister],
  );

  if (import.meta.env.SSR || !persister) {
    return (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
  }

  return (
    <PersistQueryClientProvider client={client} persistOptions={persistOptions}>
      {children}
    </PersistQueryClientProvider>
  );
}
