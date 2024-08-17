import React, { useState, createContext } from "react";
import { Theme } from "../../types/theme";

const midnightTheme = {
    backgroundColor: "#204378",
    widgetColor: "#1E2B44"
} as Theme;

const ThemeContext = createContext<Theme>(midnightTheme);

const ThemeProvider:React.FC<{children?: React.ReactNode}> = ({children}) => {

    const [theme] = useState(midnightTheme);

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};

export { ThemeContext, ThemeProvider };