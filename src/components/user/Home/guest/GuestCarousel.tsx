'use client';

import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface GuestCarouselItem {
  _id: string;
  name: string;
  role: string;
  year?: string | number;
  description?: string;
  photo: string;
}

interface GuestCarouselProps {
  guests: GuestCarouselItem[];
  getImageUrl: (url: string) => string;
}

export default function GuestCarousel({ guests, getImageUrl }: GuestCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<GuestCarouselItem | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);

  const total = guests.length;

  const next = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (total === 0 || isHovering) return;
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [next, isHovering, total]);

  const getOffset = (index: number) => {
    let diff = index - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const delta = e.clientX - dragStartX;
    if (Math.abs(delta) > 60) {
      if (delta < 0) next();
      else prev();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - dragStartX;
    if (Math.abs(delta) > 60) {
      if (delta < 0) next();
      else prev();
    }
  };

  if (guests.length === 0) {
    return (
      <div className="text-center py-10 md:py-14">
        <p className="text-muted-foreground text-lg">No guests available</p>
      </div>
    );
  }

  return (
    <>
      <div
        className="relative w-full max-w-7xl mx-auto h-[320px] md:h-[420px] lg:h-[500px] select-none"
        style={{ cursor: isDragging ? 'grabbing' : 'grab', perspective: '1200px' }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setIsDragging(false);
          setIsHovering(false);
        }}
        onMouseEnter={() => setIsHovering(true)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {guests.map((guest, i) => {
          const offset = getOffset(i);
          const absOffset = Math.abs(offset);
          const isActive = offset === 0;

          if (absOffset > 3) return null;

          const scale = isActive ? 1 : Math.max(0.65, 1 - absOffset * 0.15);
          const translateX = offset * 280;
          const translateZ = isActive ? 0 : -absOffset * 120;
          const opacity = isActive ? 1 : Math.max(0.3, 1 - absOffset * 0.3);
          const blur = isActive ? 0 : absOffset * 2.5;
          const zIndex = 10 - absOffset;
          const rotateY = offset * -4;

          return (
            <button
              key={guest._id}
              onClick={() => {
                if (isActive && !isDragging) setSelected(guest);
              }}
              className="absolute left-1/2 top-1/2 w-[220px] md:w-[300px] lg:w-[340px] aspect-[3/4] rounded-[20px] overflow-hidden
                transition-all duration-700 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring
                hover:brightness-110"
              style={{
                transform: `translate(-50%, -50%) translateX(${translateX}px) translateZ(${translateZ}px) scale(${scale}) rotateY(${rotateY}deg)`,
                opacity,
                filter: blur > 0 ? `blur(${blur}px)` : 'none',
                zIndex,
                boxShadow: isActive
                  ? '0 20px 60px -12px hsla(220, 15%, 10%, 0.45)'
                  : '0 8px 30px -8px hsla(220, 15%, 10%, 0.25)',
                pointerEvents: isActive ? 'auto' : 'none',
              }}
            >
              <img
                src={getImageUrl(guest.photo) || '/video.png'}
                alt={guest.name}
                className="w-full h-full object-cover"
                loading="lazy"
                draggable={false}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/video.png';
                }}
              />
              <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-left">
                <h3 className="font-display text-xl md:text-2xl font-bold text-primary-foreground drop-shadow-lg">
                  {guest.name}
                </h3>
                <p className="text-primary-foreground/70 text-xs md:text-sm mt-1 line-clamp-2 drop-shadow-md">
                  {guest.role}
                  {guest.year != null && guest.year !== '' && ` • ${guest.year}`}
                </p>
              </div>
            </button>
          );
        })}

        <button
          onClick={prev}
          className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full
            bg-background/80 backdrop-blur-sm border border-border shadow-lg
            flex items-center justify-center text-foreground
            hover:bg-primary hover:text-primary-foreground hover:scale-110
            transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <button
          onClick={next}
          className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full
            bg-background/80 backdrop-blur-sm border border-border shadow-lg
            flex items-center justify-center text-foreground
            hover:bg-primary hover:text-primary-foreground hover:scale-110
            transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {guests.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? 'bg-primary w-6'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent
          className="w-[calc(100%-1rem)] max-w-[calc(100%-1rem)] sm:max-w-xl md:max-w-3xl max-h-[90vh] p-0 overflow-hidden border-none bg-card shadow-[var(--modal-shadow)] flex flex-col"
          showCloseButton={true}
        >
          <DialogTitle className="sr-only">{selected?.name}</DialogTitle>
          {selected && (
            <div className="flex flex-col md:flex-row overflow-y-auto min-h-0 flex-1">
              <div className="w-full md:w-[320px] h-48 sm:h-64 md:h-[400px] shrink-0 overflow-hidden bg-muted rounded-t-lg md:rounded-l-lg md:rounded-tr-none">
                <img
                  src={getImageUrl(selected.photo) || '/video.png'}
                  alt={selected.name}
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/video.png';
                  }}
                />
              </div>
              <div className="p-4 sm:p-6 md:p-8 md:w-1/2 flex flex-col justify-center min-w-0">
                <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 break-words">
                  {selected.name}
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base mb-3 md:mb-4 break-words">
                  {selected.role}
                  {selected.year != null && selected.year !== '' && ` • ${selected.year}`}
                </p>
                {selected.description && (
                  <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed line-clamp-3 break-words">
                    {selected.description}
                  </p>
                )}
                <button
                  onClick={() => setSelected(null)}
                  className="mt-6 md:mt-8 self-start px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium
                    hover:opacity-90 transition-opacity"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
