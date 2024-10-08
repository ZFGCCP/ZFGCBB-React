import React, { createContext, useState } from "react";
import { useBBQuery } from "../../hooks/useBBQuery";
import { User } from "../../types/user";

const emptyUser = {
  id: 0,
  displayName: "",
  permissions: [],
} as User;

const UserContext = createContext<User>(emptyUser);

const UserProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const user = useBBQuery<User>("users/loggedInUser");

  return (
    <UserContext.Provider value={user ? user : emptyUser}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
