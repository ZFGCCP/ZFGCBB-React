import type React from "react";
import { createContext, useState } from "react";
import { useBBQuery } from "../../hooks/useBBQuery";
import type { User } from "../../types/user";

const emptyUser = {
  id: 0,
  displayName: "Guest",
  permissions: [],
} as User;

export const UserContext = createContext<User>(emptyUser);

interface FloatingThemeSwitcherProps {
  theme: string;
  setCurrentTheme: (theme: string) => void;
}

const FloatingThemeSwitcher: React.FC<FloatingThemeSwitcherProps> = ({
  theme,
  setCurrentTheme,
}) => {
  return (
    <>
      <div className="z-50 p-1 bg-elevated border-t border-default">
        <div className="flex gap-2 items-center">
          <label className="text-dimmed">Theme:</label>
          <select
            className="bg-default border border-default rounded-md p-1"
            value={theme}
            onChange={(e) => setCurrentTheme(e.target.value)}
          >
            <option value="theme-goron">Goron</option>
            <option value="theme-kikori">Kikori</option>
            <option value="theme-midnight">Midnight</option>
          </select>
        </div>
      </div>
    </>
  );
};

interface UserProviderProps {
  children?: React.ReactNode;
}
const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { data: user } = useBBQuery<User>("/users/loggedInUser");
  const themeClassName = user?.theme ? `theme-${user.theme}` : "theme-midnight";
  const [currentTheme, setCurrentTheme] = useState(themeClassName);

  return (
    <UserContext.Provider value={user ? user : emptyUser}>
      <div id="root" className={currentTheme}>
        {children}
        {import.meta.env.DEV && (
          <FloatingThemeSwitcher
            theme={currentTheme}
            setCurrentTheme={setCurrentTheme}
          />
        )}
      </div>
    </UserContext.Provider>
  );
};

export default UserProvider;
