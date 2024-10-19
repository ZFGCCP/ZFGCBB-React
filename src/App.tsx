import type React from "react";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./providers/theme/themeProvider";
import { UserProvider } from "./providers/user/userProvider";
import QueryProvider from "./providers/query/queryProvider";

import routes from "./router.tsx";
import "./App.css";

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
