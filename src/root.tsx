import "./assets/App.css";
import UserProvider from "./providers/user/userProvider";
import QueryProvider from "./providers/query/queryProvider";
import RootLayout from "./root.layout";
import GlobalSearchProvider from "./providers/search/globalSearchProvider";
import {
  isRouteErrorResponse,
  useRouteError,
  useRouteLoaderData,
} from "react-router";
import { getResponseStatus } from "./shared/http/response.handler";
import { bbQueryOptions } from "./hooks/query/bbQueryOptions";
import { useTheme } from "./hooks/ui/useTheme";
import BBForbidden from "./components/common/BBForbidden";
import ThemePicker from "./components/common/ThemePicker";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import type { User } from "./types/user";
import type { Route } from "./+types/root";

export async function loader({ request }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie") ?? "";
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    bbQueryOptions(
      "/users/loggedInUser",
      { schema: UserSchema },
      cookie ? { Cookie: cookie } : undefined,
    ),
  );
  const user = queryClient.getQueryData<User>(["/users/loggedInUser"]);
  return {
    dehydratedState: dehydrate(queryClient),
    theme: user?.theme ?? "midnight",
  };
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
  const data = useRouteLoaderData("root") as { theme?: string } | undefined;
  const { theme, setTheme } = useTheme(data?.theme ?? "midnight");
  const showThemePicker =
    import.meta.env.DEV ||
    import.meta.env.REACT_ZFGBB_FEATURE_FLAG_ENABLE_THEME_PICKER;
  return (
    <html lang="en" className={`theme-${theme}`}>
      <head>
        <base href={import.meta.env.VITE_BASE ?? "/"} />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/pwa-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="ZFGC.com" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta
          httpEquiv="Content-Security-Policy"
          content="object-src 'none'; frame-src 'self'"
        />
        <title>ZFGC.com</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        {showThemePicker && <ThemePicker theme={theme} setTheme={setTheme} />}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  return (
    <QueryProvider>
      <HydrationBoundary state={loaderData?.dehydratedState}>
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
