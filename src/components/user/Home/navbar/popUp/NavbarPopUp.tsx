'use client'
import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const NavbarPopup = ({
  open,
  onClose,
  menu,
}: {
  open: boolean;
  onClose: () => void;
  menu: { heading: string; links: { title: string; url?: string }[] }[];
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  // close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // prevent scroll when open (optional)
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40"
      aria-modal="true"
      role="dialog"
      onMouseDown={onClose}
    >
      {/* Panel */}
    <div
        ref={ref}
        onMouseDown={(e) => e.stopPropagation()} // prevent overlay click when clicking inside panel
        className="relative w-[90%] max-w-none rounded-none bg-[#1f1f1f] shadow-lg text-sm text-gray-200"
        style={{ padding: "22px", marginTop: "2rem" }} // marginTop to match your top spacing
      >
        {/* Yellow circular close button (top-right of panel) */}
        <button
          onClick={onClose}
          className="absolute -top-4 right-4 h-8 w-8 rounded-full bg-amber-400 flex items-center justify-center shadow"
          aria-label="Close menu"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M6 6L18 18M6 18L18 6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Menu content: Swiper with 3 cards */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={3}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            pagination={{ clickable: true }}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 15,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
            }}
            className="pb-12"
          >
            {menu.map((col) => (
              <SwiperSlide key={col.heading}>
                <div className="bg-gray-800 rounded-lg p-4 h-full min-h-[200px] border border-gray-700">
                  <h3 className="text-amber-400 font-semibold mb-3 text-sm">{col.heading}</h3>
                  <ul className="space-y-2">
                    {col.links.map((l) => (
                      <li key={l.title}>
                        <a
                          href={l.url ?? "#"}
                          className="block text-sm leading-tight hover:text-amber-300 no-underline text-gray-300 transition-colors"
                        >
                          {l.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-amber-400 hover:bg-amber-500 text-black rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-amber-400 hover:bg-amber-500 text-black rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};