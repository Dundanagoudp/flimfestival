"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useAuth } from "@/context/auth-context";
import { getCookie } from "@/lib/cookies";

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  const { userRole, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  
  // Ensure component is mounted before determining role to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // During SSR and initial render, use a consistent default
  const role = mounted ? (userRole || getCookie("userRole")) : null;
  const baseLabel = role === "admin" ? "Admin Panel" : "Editor Panel";
  const baseHref = "/admin/dashboard";
  const segments = pathname.replace(/^\/+/g, '').split('/');
  
  // Only show breadcrumb for admin routes
  if (segments[0] !== 'admin') return null;
  
  // Show loading state during initial render to prevent hydration mismatch
  if (!mounted || isLoading) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/admin/dashboard">Loading...</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }
  
  // Hide dynamic ID-like segments from breadcrumb (e.g., numeric IDs, 24-char hex IDs)
  const isIdLike = (seg: string) => /^(?:[0-9]+|[0-9a-fA-F]{24})$/.test(seg);

  const meaningfulSegments = segments.slice(1).filter((seg) => !isIdLike(seg));

  const items = [
    { label: baseLabel, href: baseHref },
    ...meaningfulSegments.map((seg, idx) => {
      const label = seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      const href = '/admin/' + meaningfulSegments.slice(0, idx + 1).join('/');
      return { label, href };
    })
  ];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href={baseHref}>{baseLabel}</BreadcrumbLink>
        </BreadcrumbItem>
        {items.length > 1 && <BreadcrumbSeparator className="hidden md:block" />}
        {items.slice(1).map((item, idx) => (
          <React.Fragment key={item.href}>
            <BreadcrumbItem>
              {idx === items.length - 2 ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {idx < items.length - 2 && <BreadcrumbSeparator className="hidden md:block" />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
} 