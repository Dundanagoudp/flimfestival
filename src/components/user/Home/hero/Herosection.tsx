'use client'
import React, { useState, useEffect } from 'react';

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      // Support both initial MediaQueryList and change events
      const matches = 'matches' in e ? e.matches : (e as MediaQueryList).matches;
      setIsMobile(matches);
    };
    handleChange(mql);
    const listener = (e: MediaQueryListEvent) => handleChange(e);
    mql.addEventListener('change', listener);
    return () => mql.removeEventListener('change', listener);
  }, []);

  const parallaxOffset = isMobile ? 0 : scrollY * 0.2;
  return (
    <section
      className="w-full relative overflow-hidden md:h-screen h-[70vh]"
    >
      {/* Video background (all devices) */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transform: `translateY(${parallaxOffset}px)`,
          transition: 'transform 0.1s linear',
          willChange: 'transform',
        }}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/video.png"
        aria-hidden="true"
      >
        <source src="/HeroVideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="absolute inset-0 flex items-end justify-start px-10 md:px-20 pb-20 md:pb-32">
        <div className="space-y-6 text-white max-w-2xl">
          <p className="text-primary text-3xl font-medium">
            Arunachal Film Festival
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Discover film,<br />
            reimagine the world
          </h1>

          
          <div className="w-full border-t border-gray-500"></div>

          <p className="text-base md:text-lg mt-6">
            Your story comes alive with amazing visuals wrapped up in top-notch
            animation video production and engaging storytelling.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
