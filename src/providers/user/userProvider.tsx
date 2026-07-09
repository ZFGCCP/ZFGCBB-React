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

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { data: user } = useBBQuery("/users/loggedInUser", {
    schema: UserSchema,
  });

  return (
    <UserContext.Provider value={user ? user : emptyUser}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
