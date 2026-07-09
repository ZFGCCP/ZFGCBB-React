import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

let refreshState: "idle" | "refreshing" | "stale" = "idle";

async function tryRefresh() {
  if (refreshState !== "idle") return;
  if (import.meta.env.SSR) return;
  refreshState = "refreshing";
  try {
    const response = await apiFetch(`${getApiBaseUrl()}/users/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (response.ok) {
      await queryClient.invalidateQueries();
      refreshState = "idle";
    } else {
      refreshState = "stale";
    }
  } catch {
    refreshState = "stale";
  }
}

function on401(error: unknown) {
  if (getResponseStatus(error) !== 401) return;
  void tryRefresh();
}

const PERSIST_MAX_AGE = 1000 * 60 * 60 * 24;

const makeQueryClient = () =>
  new QueryClient({
    queryCache: new QueryCache({ onError: on401 }),
    mutationCache: new MutationCache({ onError: on401 }),
    defaultOptions: { queries: { gcTime: PERSIST_MAX_AGE } },
  });

const queryClient = makeQueryClient();

export const getQueryClient = () => queryClient;

const persister = import.meta.env.SSR
  ? undefined
  : createAsyncStoragePersister({
      storage: window.localStorage,
      key: "zfgbb-query-cache",
    });

const QueryProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [client] = useState(() =>
    import.meta.env.SSR ? makeQueryClient() : queryClient,
  );

  if (import.meta.env.SSR || !persister) {
    return (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
  }

  return (
    <PersistQueryClientProvider
      client={client}
      persistOptions={{
        persister,
        maxAge: PERSIST_MAX_AGE,
        buster: "zfgbb-v1",
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
};

export default QueryProvider;
