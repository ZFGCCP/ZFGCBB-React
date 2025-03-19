import { css } from "@linaria/core";

import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { ThemeProvider } from "./providers/theme/themeProvider";
import { UserProvider } from "./providers/user/userProvider";
import QueryProvider from "./providers/query/queryProvider";
import ContentView from "./rootLayout.component";

css`
  :global() {
    :root {
      box-sizing: border-box;
      --linaria-1: #b24592;
      --linaria-2: #f15f79;
      --text: #fff;
      --bg: #204378;
    }

    html,
    body,
    #root {
      height: 100dvh;
      width: 100dvw;
    }

    html,
    body {
      overflow: hidden;
    }

    #root {
      overflow: auto;
      background-color: var(--bg);
      color: var(--text);
    }

    body {
      font-family: sans-serif;
    }
  }
`;

import "./assets/App.css";

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
      <body>
        {children}
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
          <ContentView />
        </ThemeProvider>
      </UserProvider>
    </QueryProvider>
  );
}

export function ErrorBoundary() {}
