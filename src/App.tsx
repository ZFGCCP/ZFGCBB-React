import React from "react";
import { ThemeProvider } from "./providers/theme/themeProvider";
import ContentView from "./components/contentView.component";
import { UserProvider } from "./providers/user/userProvider";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import QueryProvider from "./providers/query/queryProvider";

const App:React.FC = () => {
  return (
    <>
      <QueryProvider>
        <UserProvider>
          <ThemeProvider>
            <ContentView/>
          </ThemeProvider>
        </UserProvider>
      </QueryProvider>
    </>
  );
};

export default App;
