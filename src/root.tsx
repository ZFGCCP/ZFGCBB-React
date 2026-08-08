import {
  data,
  isRouteErrorResponse,
  useMatches,
  useRouteError,
  useRouteLoaderData,
} from "react-router";

import { HydrationBoundary } from "@tanstack/react-query";
import type { DehydratedState } from "@tanstack/react-query";

import "./assets/App.css";

import UserProvider from "./providers/user/userProvider";
import QueryProvider from "./providers/query/queryProvider";
import GlobalSearchProvider from "./providers/search/globalSearchProvider";
import RootLayout from "./root.layout";
import type { Route } from "./+types/root";

const GLOBAL_QUERIES: PrefetchTarget[] = [
  {
    url: "/users/loggedInUser",
    schema: LoggedInUserResponseSchema,
    meta: { userScoped: true },
  },
  { url: "/system/site", schema: SiteInfoSchema },
];

export async function loader({ request }: Route.LoaderArgs) {
  const { dehydratedState, queryClient } = await prefetchQueries(
    request,
    GLOBAL_QUERIES,
  );
  const user = queryClient.getQueryData<User>(["/users/loggedInUser"]);
  return data(
    { dehydratedState, ...userUiPrefs(user) },
    requestIsAuthenticated(request)
      ? { headers: { "Cache-Control": "private, no-store" } }
      : undefined,
  );
}

export function headers({ loaderHeaders }: Route.HeadersArgs) {
  return loaderHeaders;
}

const TanStackQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/react-query-devtools").then((mod) => ({
        default: mod.ReactQueryDevtools,
      })),
    )
  : null;

export function HydrateFallback() {
  return (
    <QueryProvider>
      <UserProvider>
        <RootLayout>{null}</RootLayout>
      </UserProvider>
    </QueryProvider>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const routeData = useRouteLoaderData<typeof loader>("root");

  const { theme, setTheme, smileySet, setSmileySet, effectiveSmileySet } =
    useTheme(routeData?.theme, routeData?.smileySet);
  const showThemePicker =
    import.meta.env.DEV ||
    import.meta.env.REACT_ZFGBB_FEATURE_FLAG_ENABLE_THEME_PICKER === "true";
  return (
    <html
      lang="en"
      className={`theme-${theme}`}
      data-smiley-set={effectiveSmileySet}
    >
      <head>
        <base href={import.meta.env.VITE_BASE ?? "/"} />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000000" />
        <BBProdOnly>
          <link rel="manifest" href="/manifest.webmanifest" />
        </BBProdOnly>
        <link rel="apple-touch-icon" href="/pwa-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="ZFGC.com" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta
          httpEquiv="Content-Security-Policy"
          content="object-src 'none'; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com"
        />
        <title>ZFGC.com</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        {showThemePicker && (
          <BBThemePicker
            theme={theme}
            setTheme={setTheme}
            smileySet={smileySet}
            setSmileySet={setSmileySet}
          />
        )}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function isDehydratedState(value: unknown): value is DehydratedState {
  return (
    typeof value === "object" &&
    value !== null &&
    "mutations" in value &&
    Array.isArray(value.mutations) &&
    "queries" in value &&
    Array.isArray(value.queries)
  );
}

function getDehydratedState(loaderData: unknown): DehydratedState | undefined {
  if (
    typeof loaderData === "object" &&
    loaderData !== null &&
    "dehydratedState" in loaderData
  ) {
    const { dehydratedState } = loaderData;
    return isDehydratedState(dehydratedState) ? dehydratedState : undefined;
  }
  return undefined;
}

function useMergedDehydratedState(): DehydratedState {
  const matches = useMatches();
  return useMemo(() => {
    const states = matches
      .map((match) => getDehydratedState(match.loaderData))
      .filter((state): state is DehydratedState => Boolean(state));
    return {
      mutations: states.flatMap((state) => state.mutations),
      queries: states.flatMap((state) => state.queries),
    };
  }, [matches]);
}

export default function App() {
  const dehydratedState = useMergedDehydratedState();
  return (
    <QueryProvider>
      <HydrationBoundary state={dehydratedState}>
        <UserProvider>
          <GlobalSearchProvider>
            <RootLayout>
              <Outlet />
            </RootLayout>
          </GlobalSearchProvider>
        </UserProvider>
        {import.meta.env.DEV && TanStackQueryDevtools ? (
          <Suspense fallback={null}>
            <TanStackQueryDevtools buttonPosition="top-left" />
          </Suspense>
        ) : null}
        <BBReloadPrompt />
      </HydrationBoundary>
    </QueryProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const status = isRouteErrorResponse(error)
    ? error.status
    : getResponseStatus(error);

  if (status === 403) {
    return (
      <main>
        <BBForbidden />
      </main>
    );
  }

  return (
    <main className="min-h-dvh p-3.5">
      <BBError error={error instanceof Error ? error : undefined} />
    </main>
  );
}
