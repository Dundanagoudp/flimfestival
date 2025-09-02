'use client'
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function YearAward() {
  // Replace these with your actual award data
  const awards = [
    {
      id: 1,
      year: '2024',
      title: 'Best Feature Film',
      description: 'Awarded to outstanding feature films that showcase exceptional storytelling and cinematography.',
      image: 'url-of-image-1',
    },
    {
      id: 2,
      year: '2023',
      title: 'Best Documentary',
      description: 'Recognizing powerful documentaries that bring important stories to light.',
      image: 'url-of-image-2',
    },
    {
      id: 3,
      year: '2022',
      title: 'Best Short Film',
      description: 'Celebrating innovative short films with compelling narratives and creative techniques.',
      image: 'url-of-image-3',
    },
  ];

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
          onSlideChange={() => console.log('slide change')}
          onSwiper={(swiper) => console.log(swiper)}
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
            <SwiperSlide key={award.id}>
              <Card className="h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{award.title}</CardTitle>
                    <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                      {award.year}
                    </span>
                  </div>
                  <CardDescription className="text-sm">
                    {award.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={award.image}
                      alt={`${award.title} - ${award.year}`}
                      className="w-full h-full object-cover"
                    />
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
