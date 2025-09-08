'use client'
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getAllAwards } from '@/services/awardService';
import { GetAllAwardsResponse } from '@/types/awardTypes';

export default function YearAward() {
  const [awards, setAwards] = useState<GetAllAwardsResponse>([]);
  useEffect(() => {
    const fetchAwards = async () => {
      const response = await getAllAwards();
      console.log("Awards", response);
      setAwards(Array.isArray(response) ? response : []); 
    };
    fetchAwards();
  }, []);

  return (
    <main className="w-full px-4" style={{ backgroundColor: "#ffffff" }}>
    <div className="px-10 py-10">
      <h1 className="text-2xl">Arunachal Film Festival</h1>
      <h1 className="text-6xl font-bold">Awards</h1>
    </div>
    <div className="swiper-container px-10">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        onSlideChange={() => {}}
        onSwiper={() => {}}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
      >
        {awards.map((award) => (
          <SwiperSlide key={award._id}>
            <Card className="h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">{award.title}</CardTitle>
                <CardDescription className="text-sm">
                  {award.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
                  <img
                    src={award.image}
                    alt={`${award.title}`}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 right-2 text-sm font-bold text-white bg-black/70 px-3 py-1 rounded-md backdrop-blur-sm">
                    {new Date(award.createdAt).getFullYear()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  </main>
  
  );
}
