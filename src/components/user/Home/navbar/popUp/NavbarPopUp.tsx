"use client";

import * as React from "react";
import Link from "next/link";
import { X } from "lucide-react";

interface MenuLink {
  title: string;
  url?: string;
}

interface MenuSection {
  heading: string;
  links: MenuLink[];
}

interface MegaMenuProps {
  open: boolean;
  onClose: () => void;
  menu: MenuSection[];
}

export function MegaMenu({ open, onClose, menu }: MegaMenuProps) {
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/30 transition-opacity duration-300 ease-out ${
        open ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
      aria-hidden={!open}
    >
      {/* Floating Close Icon */}
      <button
        onClick={onClose}
        className={`absolute top-5 right-8 rounded-full bg-primary p-2 shadow-md hover:bg-yellow-400 hover:shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 ease-out ${
          open ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'
        }`}
        aria-label="Close menu"
      >
        <X className="w-5 h-5 text-gray-800 hover:text-gray-900 hover:rotate-90 transition-all duration-300 ease-in-out" />
      </button>

      {/* stop click from closing when interacting with the panel */}
      <div
        className={`absolute top-20 right-0 h-full w-1/2 transition-transform duration-400 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="">
          {/* panel that matches the dark mega menu design */}
          <div className={`rounded-xl bg-[#1b1b1b] border border-gray-800 shadow-2xl p-6 transition-all duration-500 ease-out delay-100 ${
            open ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
          }`}>

            <div className="flex flex-wrap gap-8">
              {menu.map((section, index) => (
                <div
                  key={section.heading}
                  className={`min-w-[160px] flex-1 transition-all duration-500 ease-out ${
                    open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                  style={{
                    transitionDelay: open ? `${200 + index * 100}ms` : '0ms'
                  }}
                >
                  <h3 className="text-sm font-semibold mb-3 text-yellow-400">
                    {section.heading}
                  </h3>
                  <ul className="list-none m-0 p-0 space-y-2">
                    {section.links.map((link, linkIndex) => (
                      <ListItem
                        key={link.title}
                        title={link.title}
                        href={link.url || "#"}
                        onClick={onClose}
                        delay={open ? `${300 + index * 100 + linkIndex * 50}ms` : '0ms'}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ListItem({
  title,
  href,
  onClick,
  delay,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & {
  href: string;
  onClick?: () => void;
  delay?: string;
}) {
  return (
    <li
      {...props}
      className={`transition-all duration-400 ease-out ${delay ? '' : ''}`}
      style={{ transitionDelay: delay }}
    >
      <Link href={href} onClick={onClick} className="no-underline">
        <span className="text-sm font-medium leading-none text-gray-300 hover:text-white transition-colors duration-200 block py-1">
          {title}
        </span>
      </Link>
    </li>
  );
}

export default MegaMenu;
