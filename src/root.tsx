import "./assets/App.css";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import ThemeProvider from "./providers/theme/themeProvider";
import UserProvider from "./providers/user/userProvider";
import QueryProvider from "./providers/query/queryProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import RootLayout from "./rootLayout.component";
import Skeleton from "./components/common/skeleton.component";

export function HydrateFallback() {
  return <Skeleton />;
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
        <base href={import.meta.env.VITE_BASE_URI ?? "/"} />
      </head>
      <body id="root">
        <RootLayout children={children} />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <QueryProvider>
      <UserProvider>
        <ThemeProvider>
          <Outlet />
        </ThemeProvider>
      </UserProvider>
      {(import.meta.env.DEV && <ReactQueryDevtools />) || null}
    </QueryProvider>
  );
}

export function ErrorBoundary() {}
