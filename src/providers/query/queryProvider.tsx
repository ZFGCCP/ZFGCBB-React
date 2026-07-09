import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

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

const makeQueryClient = () =>
  new QueryClient({
    queryCache: new QueryCache({ onError: on401 }),
    mutationCache: new MutationCache({ onError: on401 }),
  });

const queryClient = makeQueryClient();

export const getQueryClient = () => queryClient;

const QueryProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [client] = useState(() =>
    import.meta.env.SSR ? makeQueryClient() : queryClient,
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

export default QueryProvider;
