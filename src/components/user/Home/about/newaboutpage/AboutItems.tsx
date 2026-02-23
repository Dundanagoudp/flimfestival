"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PosterCarousel from "../PosterCarousel";
import type { PosterItem } from "../PosterCarousel";
import { getAboutItems } from "@/services/aboutServices";
import type { AboutItem } from "@/types/aboutTypes";
import { getMediaUrl } from "@/utils/media";

const DEFAULT_HEADING = "IFFI";
const DEFAULT_PARAGRAPHS = [
  "IFFI is the only film festival in South Asia that is accredited by the International Federation of Film Producers' Associations (FIAPF) of the international festivals in the Competitive Feature Films Category.",
  "Since its inception in 1952, IFFI has been curating spectacular films from all over the world. Its goal is to provide a single platform for ambitious filmmakers, cineastes, and industry professionals to have access to excellent cinema from across the world.",
  "IFFI's International Cinema section is an assortment of culturally and aesthetically remarkable films from around the world. It has kept its stature high by committing to promote art by showcasing the international films of the year shortlisted by the eminent members associated with the Film Industry.",
];

function buildCarouselItems(items: AboutItem[]): PosterItem[] {
  const sorted = [...items].sort((a, b) => a.index - b.index);
  const list: PosterItem[] = [];
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

const AboutItems = () => {
  const [items, setItems] = useState<AboutItem[]>([]);
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

  const sorted = [...items].sort((a, b) => a.index - b.index);
  const first = sorted[0];
  const heading = first?.title?.trim() || DEFAULT_HEADING;
  const paragraphs = first ? descriptionToParagraphs(first.description) : DEFAULT_PARAGRAPHS;
  const carouselItems = buildCarouselItems(items);

  if (loading) {
    return (
      <section className="bg-white py-8 sm:py-10 md:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Shimmer header */}
          <div className="mb-8 sm:mb-10 md:mb-12 text-center">
            <div className="mb-1.5 sm:mb-2 h-3 w-24 shimmer rounded mx-auto" />
            <div className="h-8 sm:h-9 md:h-10 w-48 sm:w-56 shimmer rounded mx-auto" />
          </div>

          <div className="grid grid-cols-1 items-start gap-6 sm:gap-8 lg:grid-cols-5 lg:gap-6">
            {/* Shimmer left: text lines + button */}
            <div className="min-w-0 lg:col-span-3">
              <div className="max-w-2xl space-y-3 sm:space-y-4">
                <div className="h-4 w-full shimmer rounded" />
                <div className="h-4 w-full shimmer rounded" />
                <div className="h-4 w-[90%] shimmer rounded" />
                <div className="h-4 w-full shimmer rounded" />
                <div className="h-4 w-[85%] shimmer rounded" />
                <div className="h-4 w-full shimmer rounded" />
                <div className="h-4 w-[70%] shimmer rounded" />
                <div className="pt-3 sm:pt-4">
                  <div className="h-10 w-28 shimmer rounded-full" />
                </div>
              </div>
            </div>

            {/* Shimmer right: carousel cards */}
            <div className="min-w-0 lg:col-span-2 w-full">
              <div className="flex gap-3 sm:gap-4 overflow-hidden -mx-4 px-4 sm:mx-0 sm:px-0">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-[240px] w-[160px] sm:h-[280px] sm:w-[200px] md:h-[320px] md:w-[220px] flex-shrink-0 rounded-xl shimmer"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-8 sm:py-10 md:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header - responsive typography */}
        <div className="mb-8 sm:mb-10 md:mb-12 text-center">
          <p className="mb-1.5 sm:mb-2 font-montserrat text-xs sm:text-sm font-semibold uppercase tracking-widest text-secondary-foreground">
            What You Need to Know
          </p>
          <h2 className="font-montserrat text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            About{" "}
            <span className="relative inline-block text-primary border-b-2 border-gray-300 pb-0.5">
              {heading}
            </span>
          </h2>
        </div>

        {/* Content Grid - stack on mobile, side-by-side from lg */}
        <div className="grid grid-cols-1 items-start gap-6 sm:gap-8 lg:grid-cols-5 lg:gap-6">
          {/* Left: Text from API - full width on mobile */}
          <div className="min-w-0 lg:col-span-3">
            <div className="max-w-2xl space-y-3 sm:space-y-4">
              {first?.subtitle?.trim() && (
                <p className="font-montserrat text-base sm:text-lg leading-relaxed text-muted-foreground">
                  {first.subtitle}
                </p>
              )}
              {paragraphs.map((text, i) => (
                <p
                  key={i}
                  className="font-montserrat text-base sm:text-lg leading-relaxed text-muted-foreground"
                >
                  {text}
                </p>
              ))}

              <div className="flex flex-wrap gap-3 pt-3 sm:pt-4">
                <Button
                  size="lg"
                  className="w-auto max-w-[200px] px-6 bg-primary font-montserrat text-primary-foreground shadow-lg transition-shadow hover:shadow-xl touch-manipulation"
                  asChild
                >
                  <Link href="/aboutus">Read More</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Right: Poster Carousel - full width on mobile, below text */}
          <div className="min-w-0 lg:col-span-2 w-full">
            <PosterCarousel items={carouselItems.length > 0 ? carouselItems : undefined} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutItems;
