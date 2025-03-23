import type React from "react";
import { useState, createContext, useContext } from "react";
import type { Theme, ThemeWrapper } from "../../types/theme";

const midnightTheme = {
  borderWidth: ".2rem",
  backgroundColor: "#204378",
  widgetColor: "#1E2B44",
  footerColor: "#132241",
  headerColor: "#132241",
  black: "black",
  white: "white",
  tableRow: "#1E2B44",
  tableRowAlt: "#25334e",
  textColor: "white",
  linkColor: "white",
  linkColorVisited: "white",
} as Theme;

const themeMap: Map<String, Theme> = new Map();
themeMap.set("midnight", midnightTheme);

const ThemeContext = createContext<ThemeWrapper>({
  currentTheme: midnightTheme,
});

const ThemeProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [currentTheme] = useState<ThemeWrapper>({
    currentTheme: midnightTheme,
  });

  return (
    <ThemeContext.Provider value={currentTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
