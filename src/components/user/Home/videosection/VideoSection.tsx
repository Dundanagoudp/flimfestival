'use client'

import React from 'react'

const EMBED_URL = 'https://www.youtube.com/embed/9zFyhszmJVQ?rel=0'

export default function VideoSection() {
  return (
    <div style={{ backgroundColor: '#1A1A1A' }}>
      <main className="w-full px-4">
        <div className="px-6 md:px-10 py-6 md:py-8 relative">
          <div className="flex flex-col justify-center">
            <section className="text-center">
              <h2 className="text-3xl sm:text-5xl font-bold text-[#FFFFFF]">
                Glimpses of <span className="text-[#f4b400]">AFF</span>
              </h2>
            </section>
          </div>

          <section className="flex justify-center mt-10">
            <div className="w-full max-w-[1140px] group relative">
              <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-white shadow-md">
                <div className="relative w-full" style={{ paddingBottom: '42%' }}>
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={EMBED_URL}
                    title="Glimpses of AFF"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}  