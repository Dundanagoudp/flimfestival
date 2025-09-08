'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { getVideoHome } from '@/services/galleryServices';
import { GetAllMediaResponse, MediaItem } from '@/types/HomeTypes';
export default function VideoSection() {

  const [video, setVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response : GetAllMediaResponse  = await getVideoHome();
        const firstVideoUrl =response[0].video;
        console.log("First video URL:", firstVideoUrl);
        setVideo(firstVideoUrl || null);
       
      } catch (err: any) {
        console.log("error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, []);
  return (
    <div style={{ backgroundColor: '#1A1A1A' }}>
      <main className="w-full px-4">
        <div className="px-10 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[30%_70%]  ">
            <div></div>

            {/* Right side About content */}
            <div className="flex flex-col justify-center">
              <section className="space-y-4">
                <h2 className="text-4xl font-bold text-[#FFFFFF]">About AFF</h2>
                <p className="text-3xl text-[#989898] leading-relaxed">
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

          </div>
          <section className="flex justify-center mt-10">
            {loading ? (
              <p className="text-white">Loading...</p>
            ) : video ? (
              <video
                src={video}
                controls
                style={{
                  width: "1140px",
                  height: "539px",
                  borderRadius: "10px",
                  objectFit: "cover",
                }}
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
