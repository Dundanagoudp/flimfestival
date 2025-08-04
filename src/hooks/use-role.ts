"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useRole(allowedRoles: string[]) {
  const { userRole, isLoading, checkAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      const verifyAccess = async () => {
        if (!userRole) {
          const isAuth = await checkAuth();
          if (!isAuth) {
            router.push("/login");
            return;
          }
        }

        if (userRole && !allowedRoles.includes(userRole)) {
          router.push("/unauthorized");
        }
      };

      verifyAccess();
    }
  }, [userRole, isLoading, allowedRoles, router, checkAuth]);

  return {
    userRole,
    isLoading,
    hasAccess: !isLoading && userRole && allowedRoles.includes(userRole),
  };
}
