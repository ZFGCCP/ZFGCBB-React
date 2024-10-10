import React, { Fragment } from "react";
import { ThemeProvider } from "./providers/theme/themeProvider";
import { UserProvider } from "./providers/user/userProvider";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import QueryProvider from "./providers/query/queryProvider";
import { RouterProvider } from "react-router-dom";

import routes from "./router.tsx";

const App: React.FC = () => {
  return (
    <QueryProvider>
      <UserProvider>
        <ThemeProvider>
          <RouterProvider router={routes} fallbackElement={<p>Loading...</p>} />
        </ThemeProvider>
      </UserProvider>
    </QueryProvider>
  );
};

export default App;
