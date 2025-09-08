"use client";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllAwards } from "@/services/awardService";
import React, { useEffect } from "react";
import Link from "next/link";

export default function AwardNomination() {
  const [awards, setAwards] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  useEffect(() => {
    const fetchAwards = async () => {
      setLoading(true);
      try {
        const response = await getAllAwards();
        const data = Array.isArray(response)
          ? response
          : (response as any)?.data?.data ?? (response as any)?.data ?? [];
        setAwards(data as any);
      } catch (err: any) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAwards();
  }, []);
  const getImagesByCategory = (categoryName: string): string[] => {
    if (!Array.isArray(awards)) return [];
    return (awards as any[])
      .filter((a) => a?.category?.name === categoryName)
      .flatMap((a) =>
        Array.isArray(a?.array_images) && a.array_images.length > 0
          ? a.array_images
          : a?.image
          ? [a.image]
          : []
      )
      .filter(Boolean) as string[];
  };

  return (
    <div>
      <main className="w-full px-4" style={{ backgroundColor: "#ffffff" }}>
        <div className="px-10 py-10">
          {/* Best Documentary Film Section */}
          <div className="space-y-10" data-section-type="Documentry-flim">
            <div className="flex justify-between">
              <div>
                <h1 className="text-lg font-bold text-primary">
                  Arunachal Film Festival
                </h1>
                <p className="text-4xl font-semibold">
                  Nomination for the best documentary film
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/awards">
                <Button className="rounded-full bg-primary text-black hover:bg-yellow-300">
                  View Schedule
                </Button></Link>
                <span
                  aria-hidden
                  className="inline-block h-4 w-4 rounded-full bg-primary"
                />
              </div>
            </div>

            {/* Documentary Films Carousel */}
            <div className="px-4 py-6">
              <Swiper
                modules={[Autoplay, Navigation, Pagination]}
                spaceBetween={16}
                slidesPerView={4} // Default to 4 slides
                centeredSlides={false}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                loop={true}
                speed={800}
                pagination={{ clickable: true }}
                navigation
                breakpoints={{
                  320: { slidesPerView: 1, spaceBetween: 10 }, // Mobile: 1 slide
                  640: { slidesPerView: 2, spaceBetween: 12 }, // Small tablets: 2 slides
                  768: { slidesPerView: 3, spaceBetween: 14 }, // Tablets: 3 slides
                  1024: { slidesPerView: 4, spaceBetween: 16 }, // Desktops: 4 slides
                }}
                className="gallery-swiper"
              >
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <SwiperSlide key={`doc-skel-${i}`}>
                        <div className="w-full h-[277px] rounded-[10px] bg-gray-100 border border-gray-200 overflow-hidden shadow-sm">
                          <Skeleton className="w-full h-full" />
                        </div>
                      </SwiperSlide>
                    ))
                  : getImagesByCategory("Documentry-flim").map((img, idx) => (
                      <SwiperSlide key={`doc-${idx}`}>
                        <div className="w-full h-[277px] rounded-[10px] bg-gray-100 border border-gray-200 overflow-hidden shadow-sm">
                          <img
                            src={img}
                            alt={`documentary ${idx + 1}`}
                            className="w-full h-full object-cover"
                            draggable="false"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
              </Swiper>
            </div>
          </div>

          {/* Best Short Film Section */}
          <div className="space-y-10" data-section-type="Short-flimss">
            <div className="flex justify-between">
              <div>
                <h1 className="text-lg font-bold text-primary">
                  Arunachal Film Festival
                </h1>
                <p className="text-4xl font-semibold">
                  Nomination for the best Short film
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/awards">
              
               
                <Button className="rounded-full bg-primary text-black hover:bg-yellow-300">
                  View Schedule
                </Button> </Link>
                <span
                  aria-hidden
                  className="inline-block h-4 w-4 rounded-full bg-primary"
                />
              </div>
            </div>

            {/* Short Films Carousel */}
            <div className="px-4 py-6">
              <Swiper
                modules={[Autoplay, Pagination]} // Removed Navigation
                spaceBetween={16}
                slidesPerView={4} // Default to 4 slides
                centeredSlides={false}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                  reverseDirection: true, // Autoplay moves from right to left
                }}
                loop={true}
                speed={800}
                pagination={{ clickable: true }}
                // Removed navigation prop
                breakpoints={{
                  320: { slidesPerView: 1, spaceBetween: 10 }, // Mobile: 1 slide
                  640: { slidesPerView: 2, spaceBetween: 12 }, // Small tablets: 2 slides
                  768: { slidesPerView: 3, spaceBetween: 14 }, // Tablets: 3 slides
                  1024: { slidesPerView: 4, spaceBetween: 16 }, // Desktops: 4 slides
                }}
                className="gallery-swiper"
              >
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <SwiperSlide key={`short-skel-${i}`}>
                        <div className="w-full h-[277px] rounded-[10px] bg-gray-100 border border-gray-200 overflow-hidden shadow-sm">
                          <Skeleton className="w-full h-full" />
                        </div>
                      </SwiperSlide>
                    ))
                  : getImagesByCategory("Short-flimss").map((img, idx) => (
                      <SwiperSlide key={`short-${idx}`}>
                        <div className="w-full h-[277px] rounded-[10px] bg-gray-100 border border-gray-200 overflow-hidden shadow-sm">
                          <img
                            src={img}
                            alt={`short film ${idx + 1}`}
                            className="w-full h-full object-cover"
                            draggable="false"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
              </Swiper>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
