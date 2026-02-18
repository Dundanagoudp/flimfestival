import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define the protected paths
const protectedPaths = [
  '/admin/dashboard',
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is protected
  const isProtected = protectedPaths.some((path) =>
    pathname === path || pathname.startsWith(`${path}/`)
  );

  // Auth is via HttpOnly cookie on the API origin; this middleware runs on the app origin
  // and cannot see that cookie. Rely on client-side auth (auth context + ProtectedRoute) to redirect.
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard/:path*'],
};
