'use client'

import { Menu } from "lucide-react";
import React, { useState, useEffect } from "react";
import { MegaMenu } from "./popUp/NavbarPopUp";

const SCROLL_THRESHOLD_PX = 80;

const sampleMenu: { heading: string; links: { title: string; url?: string }[] }[] = [
  {
    heading: "About Us",
    links: [
      { title: "About AFF", url: "/aboutus" },
      { title: "Glimpses of AFF 2025", url: "/archive" },
      { title: "Festive Venue", url: "/aboutus" },
      { title: "Contact Us", url: "/contactus" },
    ],
  },
  {
    heading: "Film Selection",
    links: [
      { title: "Invitees Film", url: "/awards" },
      { title: "Short Film", url: "/films" },
      { title: "Short Documentary", url: "/films" },
    ],
  },
  {
    heading: "Media",
    links: [
      { title: "Blogs", url: "/blogs" },
      { title: "Gallery", url: "/archive" },
      { title: "10th AFF Catalogue", url: "/archive" }
    ],
  },
  {
    heading: "Master Class/Workshop",
    links: [{ title: "10th AFF Schedule", url: "/workshop" }],
  },
];

const Navbar = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const toggle = () => setIsPopupOpen((s) => !s);
  const close = () => setIsPopupOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY >= SCROLL_THRESHOLD_PX);
    };
    handleScroll(); // set initial state
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // When scrolled: clean white header with subtle shadow and blur; smooth theme-friendly transition.
  const headerClass = isScrolled
    ? "bg-white/95 backdrop-blur-md shadow-md transition-all duration-300 ease-out"
    : "bg-transparent transition-all duration-300 ease-out";

  return (
    <section className={`${headerClass} py-4 px-4`}>
      <div className="w-full px-4">
        {/* Desktop Menu */}
        <nav className="hidden items-center justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <a href="/" className="flex items-center gap-4">
              <img src="/govLogo.png" className="max-h-12" alt="Gov Logo" />
              <img src="/logo.png" className="max-h-12" alt="Logo" />
            </a>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              aria-expanded={isPopupOpen}
              aria-label="Open menu"
              onClick={toggle}
              className={`bg-primary rounded-full p-2 border border-transparent hover:bg-yellow-400 hover:shadow-md active:scale-95 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${isScrolled ? 'focus:ring-offset-white' : 'focus:ring-offset-transparent'}`}
            >
              <Menu className="h-5 w-5 text-gray-800 transition-all duration-200 hover:scale-110" aria-hidden="true" />
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center gap-4">
              <img src="/govLogo.png" className="max-h-12" alt="Gov Logo" />
              <img src="/logo.png" className="max-h-12" alt="Logo" />
            </a>
            <button
              type="button"
              aria-expanded={isPopupOpen}
              aria-label="Open menu"
              onClick={toggle}
              className={`bg-primary rounded-full p-2 border border-transparent hover:bg-yellow-400 hover:shadow-md active:scale-95 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${isScrolled ? 'focus:ring-offset-white' : 'focus:ring-offset-transparent'}`}
            >
              <Menu className="h-5 w-5 text-gray-800 transition-all duration-200 hover:scale-110" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Mega Menu */}
      <MegaMenu open={isPopupOpen} onClose={close} menu={sampleMenu} />
    </section>
  );
};

export { Navbar };



