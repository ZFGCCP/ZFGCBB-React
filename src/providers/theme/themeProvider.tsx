import React, { useState, createContext, useContext } from "react";
import { Theme, ThemeWrapper } from "../../types/theme";
import { UserContext } from "../user/userProvider";


const midnightTheme = {
    borderWidth: ".2rem",
    backgroundColor: "#204378",
    widgetColor: "#1E2B44",
    black: "black",
    tableRow: "#1E2B44",
    tableRowAlt:"#25334e",
    textColor: "white"
} as Theme;

const themeMap:Map<String, Theme> = new Map();
themeMap.set("midnight", midnightTheme);

const ThemeContext = createContext<ThemeWrapper>({currentTheme: midnightTheme});

const ThemeProvider:React.FC<{children?: React.ReactNode}> = ({children}) => {

    const {theme} = useContext(UserContext);
    const [currentTheme, setCurrentTheme] = useState<ThemeWrapper>({currentTheme: midnightTheme});

    if(theme){
        const loadedTheme = themeMap.get(theme);
        if(loadedTheme){
            setCurrentTheme({currentTheme: loadedTheme});
        }
    }

    return (
        <ThemeContext.Provider value={currentTheme}>
            {children}
        </ThemeContext.Provider>
    );
};

export { ThemeContext, ThemeProvider };