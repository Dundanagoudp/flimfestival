"use client";

import * as React from "react";
import Link from "next/link";
import { X, ChevronDown } from "lucide-react";
import { sanitizeUrl } from "@/lib/sanitize";

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

  React.useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevScrollY = window.scrollY;
    if (open) {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
    } else {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    }
    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      window.scrollTo(0, prevScrollY);
    };
  }, [open]);

  const [expandedSections, setExpandedSections] = React.useState<Set<number>>(new Set());
  const toggleSection = (index: number) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/30 transition-opacity duration-300 ease-out"
      onClick={onClose}
      aria-hidden={!open}
    >
      {/* ========== MOBILE ONLY: Sidebar (slide-in from right) – unchanged ========== */}
      <div
        className={`sm:hidden fixed top-0 right-0 z-[100] h-full w-[min(100%,320px)] bg-[#1b1b1b] border-l border-gray-800 shadow-2xl flex flex-col overflow-hidden transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between shrink-0 px-4 py-4 border-b border-gray-800">
          <span className="text-sm font-semibold text-yellow-400 uppercase tracking-wide">
            Menu
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-[#1b1b1b]"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <nav className="p-4" aria-label="Main navigation">
            <ul className="list-none m-0 p-0 divide-y divide-gray-800">
              {menu.map((section, index) => {
                const isExpanded = expandedSections.has(index);
                const contentId = `mega-accordion-panel-${index}`;
                return (
                  <li key={section.heading} className="py-1">
                    <button
                      type="button"
                      onClick={() => toggleSection(index)}
                      aria-expanded={isExpanded}
                      aria-controls={contentId}
                      className="w-full flex items-center justify-between py-3 text-left"
                    >
                      <span className="text-sm font-semibold text-yellow-400">
                        {section.heading}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-gray-300 transition-transform duration-200 shrink-0 ml-2 ${isExpanded ? "rotate-180" : ""}`}
                        aria-hidden="true"
                      />
                    </button>
                    <div
                      id={contentId}
                      className={`overflow-hidden transition-[max-height] duration-300 ease-out ${isExpanded ? "max-h-96" : "max-h-0"}`}
                    >
                      <ul className="list-none m-0 p-0 space-y-1 pb-2">
                        {section.links.map((link) => (
                          <ListItem
                            key={link.title}
                            title={link.title}
                            href={sanitizeUrl(link.url || "") || "#"}
                            onClick={onClose}
                          />
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>
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
      className="transition-all duration-400 ease-out"
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
