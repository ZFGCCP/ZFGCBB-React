import "./assets/App.css";
import UserProvider from "./providers/user/userProvider";
import QueryProvider from "./providers/query/queryProvider";
import RootLayout from "./root.layout";
import GlobalSearchProvider from "./providers/search/globalSearchProvider";
import {
  data,
  isRouteErrorResponse,
  useMatches,
  useRouteError,
  useRouteLoaderData,
} from "react-router";
import { getResponseStatus } from "./shared/http/response.handler";
import {
  prefetchQueries,
  requestIsAuthenticated,
  type PrefetchTarget,
} from "./shared/http/ssrPrefetch";
import { useTheme, userUiPrefs } from "./hooks/ui/useTheme";
import BBForbidden from "./components/common/BBForbidden";
import ThemePicker from "./components/common/ThemePicker";
import BBProdOnly from "./components/common/BBProdOnly";
import { HydrationBoundary } from "@tanstack/react-query";
import type { DehydratedState } from "@tanstack/react-query";
import type { User } from "./types/user";
import type { Route } from "./+types/root";

const GLOBAL_QUERIES: PrefetchTarget[] = [
  {
    url: "/users/loggedInUser",
    schema: UserSchema,
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
  const data = useRouteLoaderData("root") as
    | { userId?: number; theme?: string; smileySet?: string }
    | undefined;
  const { theme, setTheme, smileySet, setSmileySet, effectiveSmileySet } =
    useTheme(data?.theme, data?.smileySet);
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
          <ThemePicker
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

function useMergedDehydratedState(): DehydratedState {
  const matches = useMatches();
  return useMemo(() => {
    const states = matches
      .map(
        (match) =>
          (
            match.loaderData as
              | { dehydratedState?: DehydratedState }
              | undefined
          )?.dehydratedState,
      )
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
