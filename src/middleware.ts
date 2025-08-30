import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define the protected paths
const protectedPaths = [
  '/admin/dashboard',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is protected
  const isProtected = protectedPaths.some((path) =>
    pathname === path || pathname.startsWith(`${path}/`)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Example: Check for a session cookie (customize as per your auth logic)
  const token = request.cookies.get('token')?.value;
  if (!token) {
    // Not logged in, redirect to login
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If logged in, allow access (role-based content handled in page)
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard/:path*'],
}; 