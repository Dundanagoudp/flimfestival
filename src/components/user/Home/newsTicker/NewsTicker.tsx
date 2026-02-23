"use client";

import { useEffect, useRef, useState } from "react";
import { getTickerAnnouncements } from "@/services/tickerService";
import type { TickerAnnouncement } from "@/types/tickerTypes";

function mapApiToItems(announcements: TickerAnnouncement[]) {
  const sorted = [...announcements].sort((a, b) => a.order - b.order);
  return sorted.map((item) => ({
    id: item._id,
    text: item.text,
    link: "#",
  }));
}

export default function NewsTicker() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [items, setItems] = useState<{ id: string; text: string; link: string }[]>([]);

  useEffect(() => {
    let cancelled = false;
    getTickerAnnouncements()
      .then((list) => {
        if (!cancelled) setItems(mapApiToItems(list));
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || items.length === 0) return;

    let animationId: number;
    let position = 0;

    const scroll = () => {
      if (!isHovered) {
        position -= 1;
        const halfWidth = el.scrollWidth / 2;
        if (Math.abs(position) >= halfWidth) {
          position = 0;
        }
        el.style.transform = `translateX(${position}px)`;
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isHovered, items.length]);

  if (items.length === 0) return null;

  const doubled = [...items, ...items];

  return (
    <div
      className="ticker-bar relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="News and announcements"
    >
      <div className="ticker-glow" />
      <div ref={scrollRef} className="flex items-center whitespace-nowrap py-3">
        {doubled.map((item, i) => (
          <a
            key={`${item.id}-${i}`}
            href={item.link}
            className="ticker-item group mx-6 inline-flex items-center gap-2 text-sm font-bold tracking-wide transition-all duration-200"
          >
            <span>{item.text}</span>
            <span className="ticker-separator mx-4">||</span>
          </a>
        ))}
      </div>
    </div>
  );
}
