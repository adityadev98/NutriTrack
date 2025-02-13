import React, { createContext, ReactNode, useState } from "react";

// Define the User type
interface User {
  userid: string;
  token: string;
  name: string;
}

// Define the Context type
interface UserContextType {
  loggedUser: User | null;
  setLoggedUser: (user: User | null) => void;
}

// Create context with an undefined initial value
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Hardcoded user data
const hardcodedUser: User = {
  userid: "6792c2bbe61a8b6ed753af2c",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  name: "Taylor",
};

// Provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [loggedUser, setLoggedUser] = useState<User | null>(hardcodedUser); // Set hardcodedUser as default

  return (
    <UserContext.Provider value={{ loggedUser, setLoggedUser }}>
      {children}
    </UserContext.Provider>
  );
};
