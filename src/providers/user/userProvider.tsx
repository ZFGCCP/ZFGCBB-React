import React, { createContext, useState } from "react";
import { useBBQuery } from "../../hooks/useBBQuery";
import { User } from "../../types/user";

const emptyUser = {
    userId: 0,
    displayName: ""
} as User;

const UserContext = createContext<User>(emptyUser);

const UserProvider:React.FC<{children?: React.ReactNode}> = ({children}) => {
    const user = useBBQuery<User>("users/loggedInUser");

    return (
        <UserContext.Provider value={user ? user : emptyUser}>
            {children}
        </UserContext.Provider>

    )

};

export {UserProvider, UserContext};