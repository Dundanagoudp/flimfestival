"use client";

import { useEffect, useState } from "react";
import { getStats } from "@/services/aboutServices";

interface StatsData {
  years: number;
  films: number;
  countries: number;
}

export default function AboutStatsSection() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getStats()
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : [data];
        const first = list[0];
        if (first)
          setStats({
            years: Number(first.years ?? 0),
            films: Number(first.films ?? 0),
            countries: Number(first.countries ?? 0),
          });
      })
      .catch(() => {
        if (!cancelled) setStats(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-6 border-t border-border pt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="h-9 w-16 shimmer rounded mx-auto mb-2" />
                <div className="h-4 w-24 shimmer rounded mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!stats) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-3 gap-6 border-t border-border pt-8">
          <div className="text-center">
            <p className="font-montserrat text-3xl font-bold text-secondary-foreground">
              {stats.years}+
            </p>
            <p className="font-montserrat text-sm text-muted-foreground">Years of Legacy</p>
          </div>
          <div className="text-center">
            <p className="font-montserrat text-3xl font-bold text-secondary-foreground">
              {stats.films}+
            </p>
            <p className="font-montserrat text-sm text-muted-foreground">Films Screened</p>
          </div>
          <div className="text-center">
            <p className="font-montserrat text-3xl font-bold text-secondary-foreground">
              {stats.countries}+
            </p>
            <p className="font-montserrat text-sm text-muted-foreground">Countries</p>
          </div>
        </div>
      </div>
    </section>
  );
}
