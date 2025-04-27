
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  regNumber: string;
  username: string;
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (regNumber: string, password: string) => boolean;
  logout: () => void;
  register: (regNumber: string, username: string, password: string) => boolean;
  updateUser: (username: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user data exists in localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  }, []);

  // Mock login function
  const login = (regNumber: string, password: string) => {
    // For demo purposes, accept any password with the correct reg number
    if (regNumber === "12306740" && password) {
      const user = {
        regNumber,
        username: "TeamManager", // Default username
      };
      localStorage.setItem("user", JSON.stringify(user));
      setCurrentUser(user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const register = (regNumber: string, username: string, password: string) => {
    if (regNumber && username && password) {
      const user = {
        regNumber,
        username,
      };
      localStorage.setItem("user", JSON.stringify(user));
      setCurrentUser(user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const updateUser = (username: string) => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        username,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    login,
    logout,
    register,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
