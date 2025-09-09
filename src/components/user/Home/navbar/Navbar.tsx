'use client'
import { Menu } from "lucide-react";
import React, { useState } from "react";
import { MegaMenu } from "./popUp/NavbarPopUp";



const sampleMenu: { heading: string; links: { title: string; url?: string }[] }[] = [
  {
    heading: "About Us",
    links: [
      { title: "About AFF", url: "/aboutus" },
      { title: "Glimpses of AFF 2025", url: "/gallery" },
      { title: "Festive Venue", url: "/aboutus" },
      { title: "Contact Us", url: "/contactus" },
    ],
  },
  {
    heading: "Film Selection",
    links: [
      { title: "Invitees Film", url: "/videos" },
      { title: "Short Film", url: "/videos" },
      { title: "Short Documentary", url: "/videos" },
    ],
  },
  {
    heading: "Media",
    links: [
      { title: "Blogs", url: "/blogs" }, 
      { title: "Gallery", url: "/gallery" }, 
      { title: "10th AFF Catalogue", url: "/gallery" }
    ],
  },
  {
    heading: "Master Class/Workshop",
    links: [{ title: "10th AFF Schedule", url: "/workshop" }],
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
              className="bg-primary rounded-full p-2 border border-transparent hover:bg-yellow-400 hover:shadow-md active:scale-95 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
            >
              <Menu className="h-5 w-5 transition-transform duration-200 hover:scale-110" />
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
              className="bg-primary rounded-full p-2 border border-transparent hover:bg-yellow-400 hover:shadow-md active:scale-95 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
            >
              <Menu className="h-5 w-5 transition-transform duration-200 hover:scale-110" />
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



