"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/auth-context";

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
  const { userRole, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (authPage && userRole) {
      router.replace("/admin/dashboard");
      return;
    }

    if (!authPage) {
      if (!userRole) {
        router.replace("/login");
        return;
      }
      if (allowedRoles && !allowedRoles.includes(userRole)) {
        router.replace("/unauthorized");
        return;
      }
    }
  }, [router, allowedRoles, authPage, userRole, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!authPage && !userRole) {
    return null;
  }
  if (authPage && userRole) {
    return null;
  }

  return <>{children}</>;
}
