'use client'
import { Book, Menu, Sunset, Trees, Zap } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { NavbarPopup } from "./popUp/NavbarPopUp";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}



const sampleMenu: { heading: string; links: { title: string; url?: string }[] }[] = [
  {
    heading: "About Us",
    links: [
      { title: "About AFF" },
      { title: "Glimpses of AFF 2025" },
      { title: "Festive Venue" },
      { title: "Contact Us" },
    ],
  },
  {
    heading: "Film Selection",
    links: [
      { title: "Invitees Film" },
      { title: "Short Film" },
      { title: "Short Documentary" },
    ],
  },
  {
    heading: "Media",
    links: [{ title: "Blogs" }, { title: "Gallery" }, { title: "10th AFF Catalogue" }],
  },
  {
    heading: "Master Class/Workshop",
    links: [{ title: "10th AFF Schedule" }],
  },
];

const Navbar = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const toggle = () => setIsPopupOpen((s) => !s);
  const close = () => setIsPopupOpen(false);

  return (
    <section className="bg-transparent py-4 px-4">
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
              aria-expanded={isPopupOpen}
              onClick={toggle}
              className="bg-primary rounded-full p-2 border border-transparent hover:opacity-90"
            >
              <Menu className="h-5 w-5" />
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
              aria-expanded={isPopupOpen}
              onClick={toggle}
              className="bg-primary rounded-full p-2 border border-transparent hover:opacity-90"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Popup Menu (simple) */}
      <NavbarPopup open={isPopupOpen} onClose={close} menu={sampleMenu} />
    </section>
  );
};

export { Navbar };

/* --------------------------
   Simple Popup component
   -------------------------- */


