"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie, deleteCookie } from "@/lib/cookies";
import { logoutUser } from "@/services/authService";
import { getMyProfile } from "@/services/userServices";
import type { User } from "@/types/user-types";

type AuthContextType = {
  user: User | null;
  userRole: string | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const userRole = user?.role ?? null;

  const checkAuth = async () => {
    try {
      const profileResponse = await getMyProfile();
      if (profileResponse.success && profileResponse.data) {
        setUser(profileResponse.data);
        setCookie("userRole", profileResponse.data.role, { days: 1 });
        return true;
      }
      setUser(null);
      return false;
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth();
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setCookie("userRole", userData.role, { days: 1 });
  };

  const logout = async () => {
    try {
      await logoutUser();
      deleteCookie("userRole");
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      deleteCookie("userRole");
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, userRole, isLoading, login, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ... useAuth hook remains the same
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
