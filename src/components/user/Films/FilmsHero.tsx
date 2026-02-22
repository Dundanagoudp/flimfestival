"use client"

import React, { useState, useEffect } from "react"

export default function FilmsHero() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="w-full h-150 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(/home.png)",
          transform: `translateY(${scrollY * 0.2}px)`,
          transition: "transform 0.1s linear",
        }}
      />
      <div className="absolute inset-0 bg-black opacity-40" />
      <div className="absolute inset-0 flex items-end justify-start px-10 md:px-20 pb-20 md:pb-32">
        <div className="space-y-6 text-white max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">Films</h1>
          <div className="w-full border-t border-gray-500" />
        </div>
      </div>
    </section>
  )
}
