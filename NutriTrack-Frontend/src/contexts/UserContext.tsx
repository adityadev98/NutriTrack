import React, { createContext, ReactNode, useState, useEffect, useCallback} from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance"; 

// Define the User type
interface User {
  userid: string;
  token: string;
  name: string;
  profileCompleted: boolean;
  userType: "customer" | "admin" | "coach"; 
  verified: boolean;
  tokenExpiry: number;
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
  let lastActivityTime = Date.now(); // Track last activity time

  // Handle token expiration
  useEffect(() => {
    if (!loggedUser) return;

    const currentTime = Date.now();
    
    if (loggedUser.tokenExpiry && loggedUser.tokenExpiry < currentTime) {
      console.log("Token expired! Logging out...");
      logout();
    } else {
      // Set timeout to log out exactly when the token expires
      const timeout = setTimeout(() => {
        console.log("Token expired! Logging out...");
        logout();
      }, loggedUser.tokenExpiry - currentTime);

      return () => clearTimeout(timeout); // Cleanup timeout on re-render
    }
  }, [loggedUser]);


  const logout = () => {
    navigate("/", { replace: true }); // Ensure user is redirected to Home FIRST
    
    setTimeout(() => {
      setLoggedUser(null);
      localStorage.removeItem("loggedUser");
    }, 100); // Small delay ensures redirection completes before state update
  };  
  
  // Function to refresh token when user is active
  const refreshToken = useCallback(async () => {
    if (!loggedUser) return;

    const currentTime = Date.now();
    const bufferTime = 5 * 60 * 1000; // 5 minutes before expiration

    if (loggedUser.tokenExpiry - currentTime <= bufferTime) {
      try {
        const response = await axiosInstance.post("/api/auth/refresh-token", {
          token: loggedUser.token, // Send the current token
        });

        const { token, expiresIn } = response.data;
        const newExpiry = Date.now() + expiresIn * 1000;

        console.log("Token refreshed successfully!");

        setLoggedUser((prevUser) =>
          prevUser
            ? { ...prevUser, token, tokenExpiry: newExpiry }
            : prevUser
        );

        localStorage.setItem(
          "loggedUser",
          JSON.stringify({ ...loggedUser, token, tokenExpiry: newExpiry })
        );
      } catch (error) {
        console.error("Token refresh failed. Logging out...");
        logout();
      }
    }
  }, [loggedUser, setLoggedUser, logout]);

  // Detect User Activity and Keep Token Alive
  useEffect(() => {
    const activityEvents = ["mousemove", "keydown", "click", "scroll"];
    const handleUserActivity = () => {
      lastActivityTime = Date.now(); // Update last active time
    };

    activityEvents.forEach((event) =>
      window.addEventListener(event, handleUserActivity)
    );

    const checkInactivity = setInterval(() => {
      if (!loggedUser) return;

      const currentTime = Date.now();
      if (currentTime - lastActivityTime >= loggedUser.tokenExpiry - Date.now()) {
        console.log("User inactive for too long! Logging out...");
        logout();
      } else {
        refreshToken(); // Refresh the token every 5 minutes as long as user is active
      }
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => {
      activityEvents.forEach((event) =>
        window.removeEventListener(event, handleUserActivity)
      );
      clearInterval(checkInactivity);
    };
  }, [refreshToken, loggedUser]);

  return (
    <UserContext.Provider value={{ loggedUser, setLoggedUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
