import type { User } from "../../types/user";

const emptyUser = {
  id: 0,
  displayName: "Guest",
  permissions: [],
} as User;

export const UserContext = createContext<User>(emptyUser);

interface UserProviderProps {
  children?: React.ReactNode;
}

export default function UserProvider({ children }: UserProviderProps) {
  const { data: user } = useBBQuery("/users/loggedInUser", {
    schema: UserSchema,
    meta: { userScoped: true },
  });

  return (
    <UserContext.Provider value={user ?? emptyUser}>
      {children}
    </UserContext.Provider>
  );
}
