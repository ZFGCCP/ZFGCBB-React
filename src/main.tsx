import { StrictMode, lazy } from "react";
import { createRoot } from "react-dom/client";
import { css } from "@linaria/core";
import App from "./App";
import { BrowserRouter } from "react-router-dom";


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
      height: 100%;
      background-color: var(--bg);
      color: var(--text);
    }

    body {
      font-family: sans-serif;
    }
  }
`;

const root = document.getElementById("root");

if (!root) throw new Error("Missing root node");

createRoot(root).render(
  <StrictMode>
      <App />
  </StrictMode>
);
