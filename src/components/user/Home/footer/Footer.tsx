'use client';
import Link from "next/link";

import { on } from "events";
import { useState } from "react";

export default function Footer() {
     
    const [isOpen , setIsOpen] = useState<boolean>(false);



  const footerLinks = [
   
  
    { label: "Terms & Conditions", href: "/TermsAndConditions" },
    { label: "Privacy Policy", href: "/PrivacyPolicy" },
    { label: "Shipping & Returns", href: "/ShippingAndReturnPolicy" },
    
  ];
  return (
  <footer className="bg-[#2f2f2f] text-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* top content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-center lg:text-left">
          {/* left: logo + nav */}
          <div className="space-y-6 flex flex-col items-center lg:items-start">
            <Link href="/" className="inline-flex items-center gap-4">
              <img src="/logo.png" alt="AFF logo" className="h-12 w-auto" />
            </Link>
            <nav className="flex flex-col gap-2 text-sm items-center lg:items-start">
              <Link href="/" className="text-gray-300 hover:text-white">Home</Link>
              <Link href="/aboutus" className="text-gray-300 hover:text-white">About</Link>
              <Link href="/gallery" className="text-gray-300 hover:text-white">Gallery</Link>
              <Link href="/videos" className="text-gray-300 hover:text-white">Videos</Link>
              <Link href="/contactus" className="text-gray-300 hover:text-white">Contact</Link>
            </nav>
          </div>

          {/* center: addresses + contact */}
          <div className="text-xs sm:text-sm flex flex-col items-center lg:items-start">
            <div className="mb-4">
              <h4 className="text-white text-xs sm:text-sm mb-1 font-medium">Office address</h4>
              <p className="text-gray-300 leading-relaxed">
                Directorate of Information and Public Relations<br />
                (Soochna bhawan), papu nallah, Naharlagun, Arunachal Pradesh Pin - 791110
              </p>
            </div>
            <div className="mb-6">
              <h4 className="text-white text-xs sm:text-sm mb-1 font-medium">Event Venue</h4>
              <p className="text-gray-300 leading-relaxed">
                TNZ Cinemas, above Pantaloons, C- Sector, Itanagar, Arunachal Pradesh 791111
              </p>
            </div>
            <div className="mt-4 lg:mt-10">
              <p className="text-white text-sm sm:text-base">affdipr2013@gmail.com</p>
            </div>
          </div>

          <div className="flex flex-col justify-end items-center lg:items-end text-sm">
            <div className="mt-4 flex flex-wrap justify-center lg:justify-start gap-4 text-xs sm:text-sm">
              <a className="underline text-gray-300 hover:text-white" href="https://www.facebook.com/share/1AJf83oQwr/" aria-label="Facebook" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a className="underline text-gray-300 hover:text-white" href="https://www.instagram.com/p/DNx7ML5XlnS/?igsh=bGlnOXF3NXN6NHF0" aria-label="Instagram" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a className="underline text-gray-300 hover:text-white" href="https://filmfreeway.com/ArunachalFilmFest" aria-label="Filmfreeway" rel="noopener noreferrer" target="_blank">Filmfreeway</a>
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-10 border-t border-white pt-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm">
            <div className="text-gray-300">© 2026 AFF. All Rights Reserved.</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
