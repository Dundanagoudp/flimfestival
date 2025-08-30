"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCookie } from "@/lib/cookies";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: string[];
  authPage?: boolean; 
};

export default function ProtectedRoute({
  children,
  allowedRoles,
  authPage = false, 
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const userRole = getCookie("userRole");

      if (authPage && userRole) {
        // If this is an auth page and user is logged in, redirect to dashboard
        switch (userRole) {
          case "admin":
            router.replace("/admin/dashboard");
            break;
          default:
            router.replace("/admin/dashboard");
        }
        return;
      }

      if (!authPage) {
        // For non-auth pages, check if user has required role
        if (!userRole) {
          router.replace("/login");
          return;
        }

        if (allowedRoles && !allowedRoles.includes(userRole)) {
          router.replace("/unauthorized");
          return;
        }
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [router, allowedRoles, authPage]);

  if (isChecking) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
