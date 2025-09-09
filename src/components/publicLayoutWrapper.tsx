'use client';

import { usePathname } from 'next/navigation';

import { useEffect, useState, useRef } from 'react';
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
  const [is404Page, setIs404Page] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setIsAdminRoute(pathname.startsWith('/admin'));
    setIsUserRoute(pathname.startsWith('/user'));
    setIsLoginPage(pathname === '/login');
    
    // Check if this is a 404 page by looking for the data attribute
    const check404 = () => {
      const notFoundElement = containerRef.current?.querySelector('[data-page-type="404"]');
      setIs404Page(!!notFoundElement);
    };
    
    // Check immediately and after a short delay to catch async renders
    check404();
    const timeoutId = setTimeout(check404, 100);
    
    return () => clearTimeout(timeoutId);
  }, [pathname, children]);

  // Only show header/footer on public routes after mount, and only when explicitly enabled
  const shouldShowHeaderFooter =
    mounted && showHeaderFooter === true && !isAdminRoute && !isLoginPage && !isUserRoute && !is404Page;

  return (
    <div className="flex flex-col min-h-screen" ref={containerRef}>
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