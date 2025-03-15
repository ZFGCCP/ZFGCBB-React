import { RouterProvider } from "react-router/dom";
import { ThemeProvider } from "./providers/theme/themeProvider";
import { UserProvider } from "./providers/user/userProvider";
import QueryProvider from "./providers/query/queryProvider";
import { css } from "@linaria/core";

import "./assets/App.css";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
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

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/src/favicon.svg" />
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
          <Outlet />
        </ThemeProvider>
      </UserProvider>
    </QueryProvider>
  );
}
