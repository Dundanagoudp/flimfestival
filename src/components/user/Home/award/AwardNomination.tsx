"use client";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllAwards, getNomination } from "@/services/awardService";
import { FilmItem } from "@/types/nominatedTypes";
import React, { useEffect } from "react";
import Link from "next/link";

export default function AwardNomination() {
  const [awards, setAwards] = React.useState<FilmItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  useEffect(() => {
    const fetchAwards = async () => {
      setLoading(true);
      try {
        const response = await getNomination();
        console.log("Nomination", response);
        const data = response.items || [];
        setAwards(data);
      } catch (err: any) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAwards();
  }, []);
  const getImagesByCategory = (categoryType: string): string[] => {
    if (!Array.isArray(awards)) return [];
    return awards
      .filter((a) => a?.type === categoryType)
      .map((a) => a?.image)
      .filter(Boolean);
  };

  const getSwiperConfig = (images: string[]) => {
    const imageCount = images.length;

    // Dynamic slidesPerView based on image count
    const getSlidesPerView = (defaultSlides: number) => {
      if (imageCount === 0) return 1;
      if (imageCount === 1) return 1;
      if (imageCount === 2) return 2;
      if (imageCount === 3) return 3;
      return Math.min(defaultSlides, imageCount);
    };

    return {
      slidesPerView: getSlidesPerView(4),
      spaceBetween: 16,
      centeredSlides: false,
      loop: imageCount > 3, // Only loop if we have more than 3 images
      autoplay: imageCount > 1 ? {
        delay: 3000,
        disableOnInteraction: false,
      } : false,
      speed: 800,
      pagination: { clickable: true },
      navigation: imageCount > 3, // Only show navigation if we have more than 3 images
      breakpoints: {
        320: {
          slidesPerView: getSlidesPerView(1),
          spaceBetween: 10
        },
        640: {
          slidesPerView: getSlidesPerView(2),
          spaceBetween: 12
        },
        768: {
          slidesPerView: getSlidesPerView(3),
          spaceBetween: 14
        },
        1024: {
          slidesPerView: getSlidesPerView(4),
          spaceBetween: 16
        },
      },
    };
  };

  return (
    <div>
      <main className="w-full px-4" style={{ backgroundColor: "#ffffff" }}>
        <div className="px-10 py-10">
          {/* Best Documentary Film Section */}
          <div className="space-y-10" data-section-type="documentary">
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
              {(() => {
                const documentaryImages = getImagesByCategory("documentary");
                const swiperConfig = getSwiperConfig(documentaryImages);
                return (
                  <Swiper
                    modules={[Autoplay, Navigation, Pagination]}
                    slidesPerView={swiperConfig.slidesPerView}
                    spaceBetween={swiperConfig.spaceBetween}
                    centeredSlides={swiperConfig.centeredSlides}
                    loop={swiperConfig.loop}
                    speed={swiperConfig.speed}
                    pagination={swiperConfig.pagination}
                    navigation={swiperConfig.navigation}
                    breakpoints={swiperConfig.breakpoints}
                    autoplay={swiperConfig.autoplay}
                    className="gallery-swiper"
                  >
                {loading
                  ? Array.from({ length: Math.max(documentaryImages.length, 4) }).map((_, i) => (
                      <SwiperSlide key={`doc-skel-${i}`}>
                        <div className="w-full h-[277px] rounded-[10px] bg-gray-100 border border-gray-200 overflow-hidden shadow-sm">
                          <Skeleton className="w-full h-full" />
                        </div>
                      </SwiperSlide>
                    ))
                  : documentaryImages.map((img, idx) => (
                      <SwiperSlide key={`doc-${idx}`}>
                        <div className="w-full h-[277px] rounded-[10px] bg-gray-100 border border-gray-200 hover:scale-105 transition-all duration-300 overflow-hidden shadow-sm">
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
                );
              })()}
            </div>
          </div>

          {/* Best Short Film Section */}
          <div className="space-y-10" data-section-type="short_film">
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
              {(() => {
                const shortFilmImages = getImagesByCategory("short_film");
                const swiperConfig = getSwiperConfig(shortFilmImages);
                return (
                  <Swiper
                    modules={[Autoplay, Navigation, Pagination]}
                    slidesPerView={swiperConfig.slidesPerView}
                    spaceBetween={swiperConfig.spaceBetween}
                    centeredSlides={swiperConfig.centeredSlides}
                    loop={swiperConfig.loop}
                    speed={swiperConfig.speed}
                    pagination={swiperConfig.pagination}
                    navigation={swiperConfig.navigation}
                    breakpoints={swiperConfig.breakpoints}
                    autoplay={swiperConfig.autoplay && typeof swiperConfig.autoplay === 'object' ? {
                      ...swiperConfig.autoplay,
                      reverseDirection: true, // Autoplay moves from right to left
                    } : false}
                    className="gallery-swiper"
                  >
                {loading
                  ? Array.from({ length: Math.max(shortFilmImages.length, 4) }).map((_, i) => (
                      <SwiperSlide key={`short-skel-${i}`}>
                        <div className="w-full h-[277px] rounded-[10px] bg-gray-100 border border-gray-200 overflow-hidden shadow-sm">
                          <Skeleton className="w-full h-full" />
                        </div>
                      </SwiperSlide>
                    ))
                  : shortFilmImages.map((img, idx) => (
                      <SwiperSlide key={`short-${idx}`}>
                        <div className="w-full h-[277px] rounded-[10px] bg-gray-100 hover:scale-105 transition-all duration-300 border border-gray-200 overflow-hidden shadow-sm">
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
                );
              })()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
