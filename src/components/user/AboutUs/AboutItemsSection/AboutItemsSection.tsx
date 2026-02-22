"use client";

import React, { useEffect, useState } from "react";
import { getAboutItems } from "@/services/aboutServices";
import type { AboutItem } from "@/types/aboutTypes";
import { getMediaUrl } from "@/utils/media";
import { Card } from "@/components/ui/card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { LoadingSpinner } from "@/components/common/LoaderSpinner";

function AboutItemCard({ item }: { item: AboutItem }) {
  const images = item.images ?? [];
  const hasImages = images.length > 0;

  return (
    <Card className="h-full overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm transition-transform duration-300 hover:shadow-md flex flex-col">
      {hasImages && (
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
          {images.length === 1 ? (
            <img
              src={getMediaUrl(images[0])}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <Swiper
              modules={[Autoplay]}
              spaceBetween={0}
              slidesPerView={1}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              loop
              speed={500}
              className="h-full w-full"
            >
              {images.map((url, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={getMediaUrl(url)}
                    alt={`${item.title} ${i + 1}`}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      )}
      <div className="p-4 flex-1 flex flex-col gap-1">
        <h3 className="font-semibold text-slate-900 line-clamp-2">{item.title}</h3>
        {item.subtitle && (
          <p className="text-sm text-slate-600 line-clamp-1">{item.subtitle}</p>
        )}
        {item.description && (
          <p className="text-sm text-slate-500 line-clamp-3 mt-1">{item.description}</p>
        )}
      </div>
    </Card>
  );
}

export default function AboutItemsSection() {
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

  if (loading) {
    return (
      <section className="w-full py-10 px-4">
        <div className="mx-auto max-w-7xl flex justify-center py-12">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-10 px-4 bg-gray-50/50">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">About</h2>
        {/* Mobile: Swiper carousel */}
        <div className="sm:hidden">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={12}
            slidesPerView={1.15}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop={items.length > 1}
            speed={500}
          >
            {items.map((item) => (
              <SwiperSlide key={item.id}>
                <AboutItemCard item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {/* Desktop: horizontal scroll with snap */}
        <div className="hidden sm:block overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory">
          <div className="flex gap-4 min-w-0" style={{ scrollSnapType: "x mandatory" }}>
            {items.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-[280px] md:w-[320px] snap-start"
                style={{ scrollSnapAlign: "start" }}
              >
                <AboutItemCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
