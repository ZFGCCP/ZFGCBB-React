import type React from "react";
import { useState, createContext, useContext, useEffect } from "react";
import type { Theme, ThemeWrapper } from "../../types/theme";
import { UserContext } from "../user/userProvider";

const themeMap: Set<Theme> = new Set();
themeMap.add("midnight");

export const ThemeContext = createContext<ThemeWrapper>("midnight");

const ThemeProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { theme } = useContext(UserContext);
  const [currentTheme, setCurrentTheme] = useState<ThemeWrapper>("midnight");

  useEffect(() => {
    if (theme) {
      const loadedTheme = themeMap.has(theme as Theme) ? theme : undefined;
      if (loadedTheme) {
        setCurrentTheme(loadedTheme);
      }
    }

    const className: `theme-${Theme}` = `theme-${theme ?? "midnight"}`;
    document.body.classList.add(className);
    import(`@/assets/themes/${theme ?? "midnight"}.css`).catch(console.error);

    return () => {
      document.body.classList.remove(className);
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={currentTheme}>
      <div className={`theme-${theme ?? "midnight"} bg-background`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
