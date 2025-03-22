import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { ThemeProvider } from "./providers/theme/themeProvider";
import { UserProvider } from "./providers/user/userProvider";
import QueryProvider from "./providers/query/queryProvider";

import "./assets/App.css";
import ContentView from "./components/common/contentView";

export function HydrateFallback() {
  return (
    <img src="https://pa1.aminoapps.com/7508/074c64ca038d1e4a61d03fede5555ef1fbc047c5r1-640-640_hq.gif" />
  );
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
    </QueryProvider>
  );
}

export function ErrorBoundary() {}
