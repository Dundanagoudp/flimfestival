"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie, setCookie, deleteCookie } from "@/lib/cookies";

type AuthContextType = {
  userRole: string | null;
  isLoading: boolean;
  login: (role: string) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/check");
      const data = await res.json();

      if (data.isAuthenticated && data.role) {
        setUserRole(data.role);
        setCookie("userRole", data.role, { days: 1 });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Auth check failed:", error);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      // First check client-side cookies
      const role = getCookie("userRole");

      if (role) {
        setUserRole(role);
      } else {
        // If no client cookie, verify with server
        await checkAuth();
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (role: string) => {
    setCookie("userRole", role, { days: 1 });
    setUserRole(role);
  };

  const logout = () => {
    deleteCookie("userRole");
    setUserRole(null);
    // Call your API logout endpoint
    fetch("/api/auth/logout", { credentials: "include" })
      .then(() => router.push("/login"))
      .catch(console.error);
  };

  return (
    <AuthContext.Provider
      value={{ userRole, isLoading, login, logout, checkAuth }}
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
