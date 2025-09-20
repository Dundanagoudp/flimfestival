'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { getVideoHome } from '@/services/galleryServices';
import { GetAllMediaResponse } from '@/types/HomeTypes';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
export default function VideoSection() {

  const [video, setVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response : GetAllMediaResponse  = await getVideoHome();
        const firstVideoUrl = response?.[0]?.video;
        setVideo(firstVideoUrl || null);
       
      } catch (err: any) {
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, []);
  return (
    <div style={{ backgroundColor: '#1A1A1A' }}>
      <main className="w-full px-4">
        <div className="px-10 py-10 relative">
          {/* <div className="absolute top-0 right-0 flex items-center gap-2 group mt-10">
            <Link href="/videos">
              <Button className="rounded-full bg-primary text-black hover:bg-yellow-300 hover:scale-105 hover:shadow-lg transition-all duration-200 ease-out">
                More Videos
              </Button>
            </Link>
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary animate-pulse hover:animate-bounce cursor-pointer">
              <ArrowRight className="h-3 w-3 text-black" />
            </span>
          </div> */}

          <div className="flex flex-col justify-center">
            <section className="space-y-4">
              <h2 className="sm:text-4xl text-2xl font-bold text-[#FFFFFF]">About AFF</h2>
              <p className="sm:text-3xl text-xl text-[#989898] leading-relaxed">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
                <br />
                Lorem Ipsum has been the industry's standard dummy text ever
                since the 1500s,
                <br />
                when an unknown printer took a galley of type and scrambled it
                to make a type specimen book.
              </p>

            </section>

          </div>
          <section className="flex justify-center mt-10">
            {loading ? (
              <p className="text-white">Loading...</p>
            ) : video ? (
              <video
                src={video}
                controls
                playsInline
                className="w-full max-w-[1140px] aspect-video rounded-[10px]"
              />
            ) : (
              <p className="text-white">No video found</p>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
