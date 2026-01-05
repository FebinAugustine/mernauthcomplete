import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAuthData,
  isAuthenticated,
  User,
  clearAuthData,
} from "../utils/auth";
import { logout as apiLogout } from "../api/auth.api";
import { router } from "expo-router";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuth: boolean;
  refreshAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  const refreshAuth = async () => {
    setIsLoading(true);
    try {
      const authData = await getAuthData();
      const authenticated = await isAuthenticated();
      setUser(authData?.user || null);
      setIsAuth(authenticated);
    } catch (error) {
      console.error("Error refreshing auth:", error);
      setUser(null);
      setIsAuth(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      await clearAuthData();
      setUser(null);
      setIsAuth(false);
      router.replace("/login");
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuth, refreshAuth, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
