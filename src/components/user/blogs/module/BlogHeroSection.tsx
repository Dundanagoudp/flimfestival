'use client'
import React, { useState, useEffect } from 'react';

const BlogHeroSection = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <section
      className="w-full h-150 relative overflow-hidden"
    >
      {/* Parallax background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(/home.png)",
          transform: `translateY(${scrollY * 0.2}px)`,
          transition: 'transform 0.1s linear',
        }}
      ></div>
      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Content */}
      <div className="absolute inset-0 flex items-end justify-start px-10 md:px-20 pb-20 md:pb-32">
        <div className="space-y-6 text-white max-w-2xl">
     
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Blogs
          </h1>

          
          <div className="w-screen max-w-[250%] border-t-2 border-gray-500"></div>

        
        </div>
      </div>
    </section>
  );
};

export default BlogHeroSection;
