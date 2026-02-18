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

  // Lock body scroll while the menu is open
  React.useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalOverflow;
    }
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  // Track expanded sections for mobile accordion
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
      className={`fixed inset-0 z-50 bg-black/30 transition-opacity duration-300 ease-out ${
        open ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
      aria-hidden={!open}
    >
      {/* Floating Close Icon (all breakpoints) */}
      <button
        onClick={onClose}
        className={`inline-flex items-center justify-center absolute top-5 right-8 z-50 rounded-full bg-primary p-2 shadow-md hover:bg-yellow-400 hover:shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 ease-out ${
          open ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'
        }`}
        aria-label="Close menu"
      >
        <X className="w-5 h-5 text-gray-800 hover:text-gray-900 hover:rotate-90 transition-all duration-300 ease-in-out" />
      </button>

      {/* stop click from closing when interacting with the panel */}
      <div
        className={`absolute right-0 top-0 h-full w-full sm:top-20 sm:w-2/3 md:w-1/2 transition-transform duration-400 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        } overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="">
          {/* panel that matches the dark mega menu design */}
          <div className={`rounded-xl bg-[#1b1b1b] border border-gray-800 shadow-2xl p-4 sm:p-6 transition-all duration-500 ease-out delay-100 ${
            open ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
          }`}>
            {/* Mobile: Accordion layout */}
            <div className="sm:hidden">
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
                        <span className="text-sm font-semibold text-yellow-400">{section.heading}</span>
                        <ChevronDown
                          className={`h-4 w-4 text-gray-300 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                          aria-hidden="true"
                        />
                      </button>
                      <div
                        id={contentId}
                        className={`overflow-hidden transition-[max-height] duration-300 ease-out ${isExpanded ? 'max-h-96' : 'max-h-0'}`}
                      >
                        <ul className="list-none m-0 p-0 space-y-1 pb-2">
                          {section.links.map((link) => (
                            <ListItem
                              key={link.title}
                              title={link.title}
                              href={sanitizeUrl(link.url || '') || '#'}
                              onClick={onClose}
                            />
                          ))}
                        </ul>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Desktop: Grid layout */}
            <div className="hidden sm:flex sm:flex-row sm:flex-wrap gap-6 sm:gap-8">
              {menu.map((section, index) => (
                <div
                  key={section.heading}
                  className={`min-w-[160px] flex-1 w-full sm:w-auto transition-all duration-500 ease-out ${
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
                        href={sanitizeUrl(link.url || '') || '#'}
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
