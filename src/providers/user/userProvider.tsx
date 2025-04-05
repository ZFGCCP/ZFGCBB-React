import type React from "react";
import { createContext } from "react";
import { useBBQuery } from "../../hooks/useBBQuery";
import type { User } from "../../types/user";

const emptyUser = {
  id: 0,
  displayName: "Guest",
  permissions: [],
} as User;

export const UserContext = createContext<User>(emptyUser);

const UserProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { data: user } = useBBQuery<User>("/users/loggedInUser");

  return (
    <UserContext.Provider value={user ? user : emptyUser}>
      {children}
    </UserContext.Provider>
  );
};
export default UserProvider;
