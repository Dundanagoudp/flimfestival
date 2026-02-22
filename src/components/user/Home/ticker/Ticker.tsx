"use client";

import React, { useEffect, useState } from "react";
import { getTickerAnnouncements } from "@/services/tickerService";
import type { TickerAnnouncement } from "@/types/tickerTypes";

export default function Ticker() {
  const [items, setItems] = useState<TickerAnnouncement[]>([]);

  useEffect(() => {
    let cancelled = false;
    getTickerAnnouncements()
      .then((list) => {
        if (cancelled) return;
        const sorted = [...list].sort((a, b) => a.order - b.order);
        setItems(sorted);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <section
      className="w-full overflow-hidden border-y border-amber-900/30 bg-amber-950/90 py-2"
      aria-label="Announcements"
    >
      <div className="ticker-wrap flex">
        <div className="ticker-content flex animate-ticker gap-12 whitespace-nowrap text-sm font-medium text-amber-200">
          {[...items, ...items].map((item, i) => (
            <span key={`${item._id}-${i}`} className="shrink-0">
              {item.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
