"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PosterItem {
  src: string;
  title: string;
}

const FALLBACK_POSTERS: PosterItem[] = [
  { src: "https://placehold.co/220x320/1a1a2e/eab308?text=Festival+2025", title: "Film Festival 2025" },
  { src: "https://placehold.co/220x320/1a1a2e/eab308?text=Awards", title: "Cinema Festival Awards" },
  { src: "https://placehold.co/220x320/1a1a2e/eab308?text=Goa", title: "Film Festival Goa" },
  { src: "https://placehold.co/220x320/1a1a2e/eab308?text=Celebration", title: "Bollywood Celebration" },
];

interface PosterCarouselProps {
  items?: PosterItem[];
}

const PosterCarousel = ({ items: propItems }: PosterCarouselProps) => {
  const posters = propItems && propItems.length > 0 ? propItems : FALLBACK_POSTERS;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    el?.addEventListener("scroll", checkScroll);
    return () => el?.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
      {/* Left/right fade - light blur on mobile */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-[5] w-10 sm:w-12 bg-gradient-to-r from-background via-background/80 to-transparent backdrop-blur-[2px] sm:backdrop-blur-none" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[5] w-10 sm:w-12 bg-gradient-to-l from-background via-background/80 to-transparent backdrop-blur-[2px] sm:backdrop-blur-none" />

      {/* Arrows - visible on mobile and desktop, above blur */}
      {canScrollLeft && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-1 sm:-left-4 top-1/2 z-10 flex h-9 w-9 sm:h-10 sm:w-10 -translate-y-1/2 rounded-full border-border bg-card/90 shadow-lg backdrop-blur-sm hover:bg-card touch-manipulation"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
        </Button>
      )}
      {canScrollRight && (
        <Button
          variant="outline"
          size="icon"
          className="absolute right-1 sm:-right-4 top-1/2 z-10 flex h-9 w-9 sm:h-10 sm:w-10 -translate-y-1/2 rounded-full border-border bg-card/90 shadow-lg backdrop-blur-sm hover:bg-card touch-manipulation"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
        </Button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth scrollbar-hide overflow-y-hidden"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {posters.map((poster, i) => (
          <div
            key={i}
            className="group relative flex-shrink-0 w-[160px] sm:w-[200px] md:w-[220px] overflow-hidden rounded-lg sm:rounded-xl shadow-lg transition-transform duration-300 hover:scale-[1.03] active:scale-[0.99] touch-manipulation"
          >
            <img
              src={poster.src}
              alt={poster.title}
              className="h-[240px] sm:h-[280px] md:h-[320px] w-full object-cover"
              loading="lazy"
              sizes="(max-width: 640px) 160px, (max-width: 768px) 200px, 220px"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/80 to-transparent p-2 sm:p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100">
              <p className="font-montserrat text-xs sm:text-sm font-semibold text-primary-foreground line-clamp-2">
                {poster.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PosterCarousel;
