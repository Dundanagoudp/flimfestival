"use client";

import { useEffect, useState } from "react";
import VerticalPosterCarousel from "./VerticalPosterCarousel";
import type { VerticalPosterItem } from "./VerticalPosterCarousel";
import { getAboutItems, getStats } from "@/services/aboutServices";
import type { AboutItem } from "@/types/aboutTypes";
import { getMediaUrl } from "@/utils/media";

interface StatsData {
  years: number;
  films: number;
  countries: number;
}

const DEFAULT_HEADING = "IFFI";
const DEFAULT_PARAGRAPHS = [
  "IFFI is the only film festival in South Asia that is accredited by the International Federation of Film Producers' Associations (FIAPF) of the international festivals in the Competitive Feature Films Category.",
  "Since its inception in 1952, IFFI has been curating spectacular films from all over the world. Its goal is to provide a single platform for ambitious filmmakers, cineastes, and industry professionals to have access to excellent cinema from across the world.",
  "IFFI's International Cinema section is an assortment of culturally and aesthetically remarkable films from around the world. It has kept its stature high by committing to promote art by showcasing the international films of the year shortlisted by the eminent members associated with the Film Industry.",
];

function buildPosterItems(items: AboutItem[]): VerticalPosterItem[] {
  const sorted = [...items].sort((a, b) => a.index - b.index);
  const list: VerticalPosterItem[] = [];
  for (const item of sorted) {
    const urls = item.images ?? [];
    for (const url of urls) {
      if (url) list.push({ src: getMediaUrl(url), title: item.title });
    }
  }
  return list;
}

function descriptionToParagraphs(description: string | undefined): string[] {
  if (!description || !description.trim()) return DEFAULT_PARAGRAPHS;
  return description
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default function AboutPageSection() {
  const [items, setItems] = useState<AboutItem[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getAboutItems()
      .then((data) => {
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const sorted = [...items].sort((a, b) => a.index - b.index);
  const first = sorted[0];
  const heading = first?.title?.trim() || DEFAULT_HEADING;
  const paragraphs = first ? descriptionToParagraphs(first.description) : DEFAULT_PARAGRAPHS;
  const posterItems = buildPosterItems(items);

  if (loading) {
    return (
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-12 text-center">
            <div className="mb-2 h-3 w-28 shimmer rounded mx-auto" />
            <div className="h-10 w-48 shimmer rounded mx-auto" />
          </div>
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-5">
            <div className="lg:col-span-3 space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-4 w-full shimmer rounded" />
              ))}
              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-9 w-14 shimmer rounded" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="h-[500px] w-full shimmer rounded-xl" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-12 text-center">
          <p className="mb-2 font-montserrat text-sm font-semibold uppercase tracking-widest text-secondary-foreground">
            What You Need to Know
          </p>
          <h2 className="font-montserrat text-4xl font-bold text-foreground md:text-5xl">
            About{" "}
            <span className="relative inline-block text-primary">
              {heading}
              <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-secondary" />
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 sm:gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="max-w-2xl space-y-5">
              {first?.subtitle?.trim() && (
                <p className="font-montserrat text-lg leading-relaxed text-muted-foreground">
                  {first.subtitle}
                </p>
              )}
              {paragraphs.map((text, i) => (
                <p
                  key={i}
                  className="font-montserrat text-lg leading-relaxed text-muted-foreground"
                >
                  {text}
                </p>
              ))}
            </div>
            {/* Stats only - bottom of left side, from API */}
            {stats && (
              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8">
                <div>
                  <p className="font-montserrat text-3xl font-bold text-primary">
                    {stats.years}+
                  </p>
                  <p className="font-montserrat text-sm text-muted-foreground">Years of Legacy</p>
                </div>
                <div>
                  <p className="font-montserrat text-3xl font-bold text-primary">
                    {stats.films}+
                  </p>
                  <p className="font-montserrat text-sm text-muted-foreground">Films Screened</p>
                </div>
                <div>
                  <p className="font-montserrat text-3xl font-bold text-primary">
                    {stats.countries}+
                  </p>
                  <p className="font-montserrat text-sm text-muted-foreground">Countries</p>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 min-w-0">
            <VerticalPosterCarousel items={posterItems.length > 0 ? posterItems : undefined} />
          </div>
        </div>
      </div>
    </section>
  );
}
