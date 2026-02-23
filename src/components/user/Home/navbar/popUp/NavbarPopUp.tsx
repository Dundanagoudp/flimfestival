"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [expandedSections, setExpandedSections] = React.useState<Set<number>>(new Set());

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const menuContent = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999] isolate">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 z-[9998] bg-black/50 backdrop-blur-md"
            onClick={onClose}
          />

          {/* ===== MOBILE SIDEBAR ===== */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="absolute right-0 top-0 z-[9999] h-full w-[85%] max-w-sm bg-black shadow-2xl lg:hidden"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="flex items-center justify-between border-b border-white/20 px-5 py-4">
              <span className="text-lg font-bold text-yellow-500 tracking-wide">Menu</span>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 bg-white hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5 text-black" />
              </button>
            </div>

            <nav className="overflow-y-auto h-[calc(100%-65px)] px-5 py-4" aria-label="Main navigation">
              <ul className="space-y-1">
                {menu.map((section, index) => {
                  const isExpanded = expandedSections.has(index);
                  return (
                    <li key={section.heading} className="border-b border-white/20 last:border-0">
                      <button
                        type="button"
                        onClick={() => toggleSection(index)}
                        aria-expanded={isExpanded}
                        className="w-full flex items-center justify-between py-3 text-left group"
                      >
                        <span className="font-semibold text-yellow-500 group-hover:text-yellow-400 transition-colors">
                          {section.heading}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 text-white/80 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden pl-4 pb-2 space-y-1"
                          >
                            {section.links.map((link) => (
                              <li key={link.title}>
                                <Link
                                  href={sanitizeUrl(link.url || "") || "#"}
                                  onClick={onClose}
                                  className="block py-2 px-3 text-sm text-white hover:text-yellow-400 hover:bg-white/10 rounded-md transition-colors"
                                >
                                  {link.title}
                                </Link>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </motion.div>

          {/* ===== DESKTOP MODAL ===== */}
          <div className="hidden lg:flex items-start justify-center pt-24 z-[9999] relative">
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-4xl mx-6 rounded-2xl bg-black border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              {/* Close button */}
              <button
                type="button"
                onClick={onClose}
                className="absolute -top-4 -right-4 rounded-full bg-white p-2.5 shadow-lg hover:bg-gray-100 transition-colors group"
                aria-label="Close menu"
              >
                <X className="h-4 w-4 text-black transition-colors" />
              </button>

              <div className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {menu.map((section, index) => (
                    <motion.div
                      key={section.heading}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.06, duration: 0.3 }}
                    >
                      <h3 className="text-xs font-bold uppercase tracking-widest text-yellow-500 mb-4">
                        {section.heading}
                      </h3>
                      <ul className="space-y-2">
                        {section.links.map((link) => (
                          <li key={link.title}>
                            <Link
                              href={sanitizeUrl(link.url || "") || "#"}
                              onClick={onClose}
                              className="block text-sm text-white hover:text-yellow-400 transition-colors duration-150 py-1"
                            >
                              {link.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  if (typeof document !== "undefined" && document.body) {
    return createPortal(menuContent, document.body);
  }
  return menuContent;
}

export default MegaMenu;
