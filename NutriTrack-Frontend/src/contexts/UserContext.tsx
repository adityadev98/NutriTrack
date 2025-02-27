import React, { createContext, ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Define the User type
interface User {
  userid: string;
  token: string;
  name: string;
  profileCompleted: boolean;
  userType: "customer" | "admin"; // Added userType
}

// Define the Context type
interface UserContextType {
  loggedUser: User | null;
  setLoggedUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
}

// Create context
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [loggedUser, setLoggedUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("loggedUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (loggedUser) {
      localStorage.setItem("loggedUser", JSON.stringify(loggedUser));

      // Handle redirection
      if (loggedUser.userType === "admin") {
        navigate("/admin-dashboard");
      } else if (!loggedUser.profileCompleted) {
        navigate("/profile-setup");
      } else {
        navigate("/dashboard");
      }
    }
  }, [loggedUser, navigate]);

  const logout = () => {
    navigate("/"); //  Redirect to home first
    setLoggedUser(null); // Then remove user session
    localStorage.removeItem("loggedUser");
  };

  return (
    <UserContext.Provider value={{ loggedUser, setLoggedUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
