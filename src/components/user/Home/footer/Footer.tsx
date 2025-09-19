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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* left: logo + nav */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-4">
              <img src="/logo.png" alt="AFF logo" className="h-12 w-auto" />
            </Link>

            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/" className="text-gray-300 hover:text-white">Home</Link>
              <Link href="/aboutus" className="text-gray-300 hover:text-white">About</Link>
              <Link href="/screenings" className="text-gray-300 hover:text-white">Screenings</Link>
              <Link href="/digital-archive" className="text-gray-300 hover:text-white">Digital Archive</Link>
              <Link href="/blogs" className="text-gray-300 hover:text-white">News</Link>
              <Link href="/contactus" className="text-gray-300 hover:text-white">Contact</Link>
            </nav>
          </div>

          {/* center: addresses + divider + contact */}
          <div className="text-sm">
            <div className="mb-4">
              <h4 className="text-gray-400 text-sm mb-1">Office address</h4>
              <p className="text-gray-300 leading-relaxed">
                Directorate of Information and Public Relations (Soochna bhawan),
                papu nallah, Naharlagun, Arunachal Pradesh Pin - 791110
              </p>
            </div>

            <div className="mb-6">
              <h4 className="text-gray-400 text-sm mb-1">Event Venue</h4>
              <p className="text-gray-300 leading-relaxed">
                Dorjee Khandu State Convention Centre, Itanagar, Arunachal Pradesh Pin - 791111
              </p>
            </div>

      

            {/* contact */}
            <div className="text-center lg:text-left mt-10">
              <p className="text-white text-xl">arunachallitfest@gmail.com</p>
              <p className="mt-2 text-white font-bold text-xl">+ (91) 87945-63027</p>

             
            </div>
          </div>

        
          <div className="flex flex-col justify-end items-end text-sm">
     <div className="mt-4 flex justify-center lg:justify-start gap-4 text-sm">
                <a className="underline" href="https://www.facebook.com/share/1AJf83oQwr/" aria-label="Facebook">Facebook</a>
                <a className="underline" href="https://www.instagram.com/p/DNx7ML5XlnS/?igsh=bGlnOXF3NXN6NHF0" aria-label="Instagram">Instagram</a>
                <a className="underline" href="https://filmfreeway.com/ArunachalFilmFest" aria-label="Filmfreeway" aria-label="Filmfreeway">Filmfreeway</a>
              </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-10 border-t border-white pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <div className="text-gray-300">© 2025 AFF. All Rights Reserved.</div>

          
              <Link href="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-300 hover:text-white">Terms of Use</Link>
          
          </div>
        </div>
      </div>
    </footer>
  )
}
