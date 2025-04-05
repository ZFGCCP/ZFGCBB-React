import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { ThemeProvider } from "./providers/theme/themeProvider";
import { UserProvider } from "./providers/user/userProvider";
import QueryProvider from "./providers/query/queryProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./assets/App.css";
import ContentView from "./components/common/contentView.component";

export function HydrateFallback() {
  return <></>;
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
      </head>
      <body id="root">
        <ContentView children={children} />
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
      <ReactQueryDevtools />
    </QueryProvider>
  );
}

export function ErrorBoundary() {}
