'use client';

import { usePathname } from 'next/navigation';

import { useEffect, useState } from 'react';
import { Navbar } from './user/Home/navbar/Navbar';
import Footer from './user/Home/footer/Footer';

export default function PublicLayoutWrapper({
  children,
  showHeaderFooter,
}: {
  children: React.ReactNode;
  showHeaderFooter: boolean;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isUserRoute, setIsUserRoute] = useState(false);
  const [isLoginPage, setIsLoginPage] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsAdminRoute(pathname.startsWith('/admin'));
    setIsUserRoute(pathname.startsWith('/user'));
    setIsLoginPage(pathname === '/login');
  }, [pathname]);

  // If showHeaderFooter is explicitly false, don't show header/footer regardless of route
  const shouldShowHeaderFooter = showHeaderFooter && !isAdminRoute && !isLoginPage && !isUserRoute;

  return (
    <div className="flex flex-col min-h-screen">
      {shouldShowHeaderFooter && (
        <div className="sticky top-0 z-50 w-full">
          <Navbar />
        </div>
      )}
      <main className="flex-grow">
        {children}
      </main>
      {shouldShowHeaderFooter && <Footer/>}
    </div>
  );
} 