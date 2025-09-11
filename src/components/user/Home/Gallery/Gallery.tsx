
'use client'
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { getGalleryYearwise } from "@/services/galleryServices";
import Link from "next/link";

interface GalleryImage {
  _id: string;
  photo: string;
  year: number;
}

export default function Gallery() {
  const [gallery, setGallery] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setIsLoading(true);
        const response = await getGalleryYearwise();
        setGallery(response);
        
        // Flatten the nested structure to create a single array of images with years
        const flattenedImages: GalleryImage[] = [];
        response.forEach((yearData: any) => {
          yearData.images.forEach((image: any) => {
            flattenedImages.push({
              _id: image._id,
              photo: image.photo,
              year: yearData.year
            });
          });
        });
        
        setGalleryImages(flattenedImages);
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <div>
      <main className="w-full px-4">
        <div className="px-10 py-10">
          <div>
            <div className="flex justify-center items-center flex-col">
              <h1 className="text-6xl font-black">Gallery</h1>

              <div className="flex items-center gap-2 mt-5">
                <Link href={'/gallery'}>
                  <Button className="rounded-full bg-primary text-black hover:bg-yellow-300 hover:scale-105 hover:shadow-lg transition-all duration-200 ease-out">
                    View More
                  </Button>
                </Link>
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary animate-pulse hover:animate-bounce cursor-pointer">
                  <ArrowRight className="h-3 w-3 text-black" />
                </span>
              </div>
            </div>

          </div>
        </div>
      </main>
      
      <div className="w-full overflow-hidden rounded-[20px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : galleryImages.length > 0 ? (
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={3}
            centeredSlides={false}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              reverseDirection: true, // This makes it move from right to left
            }}
            loop={true}
            speed={800}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 15,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 16,
              },
            }}
            className="gallery-swiper"
          >
            {galleryImages.map((image) => (
              <SwiperSlide key={image._id}>
                <div className="relative overflow-hidden cursor-pointer group transform transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl">
                  <img
                    src={image.photo}
                    alt={`Gallery image from ${image.year}`}
                    className="w-full h-82 object-fill rounded-2xl"
                    draggable="false"
                    onError={(e) => {
                      // Fallback image if the API image fails to load
                      (e.target as HTMLImageElement).src = "/video.png";
                    }}
                  />
                  {/* Year overlay */}
                  <div className="absolute bottom-4 left-8 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-semibold backdrop-blur-sm">
                    {image.year}
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 text-lg">No gallery images available</p>
          </div>
        )}
      </div>
    </div>
  );
}
