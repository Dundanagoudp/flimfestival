'use client'
import React, { useState, useEffect } from 'react';

export default function VideoHero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="w-full h-150 relative overflow-hidden">
      {/* Parallax background – cover image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/home.png)",
          transform: `translateY(${scrollY * 0.2}px)`,
        }}
        aria-hidden
      />
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" aria-hidden />

      {/* Banner content – same layout as workshop page */}
      <div className="absolute inset-0 flex items-end justify-start px-10 md:px-20 pb-20 md:pb-32">
        <div className="space-y-6 text-white max-w-2xl">
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-tight whitespace-nowrap">
            Videos
          </h1>
          <div className="w-screen max-w-[250%] border-t-2 border-gray-500" />
        </div>
      </div>
    </section>
  )
}
