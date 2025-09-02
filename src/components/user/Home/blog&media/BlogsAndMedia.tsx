'use client'
import React, { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'





const posts = [
  {
    id: 1,
    title: "The Rise of Indigenous Literature in Arunachal Pradesh",
    date: "June 19, 2025",
    img: "https://via.placeholder.com/1200x700?text=Large+Placeholder",
    featured: true,
  },
  {
    id: 2,
    title: "5 Must-Attend Sessions at This Year's Festival",
    date: "June 19, 2025",
    img: "https://via.placeholder.com/600x360?text=Placeholder+2",
    featured: false,
  },
  {
    id: 3,
    title: "Meet the Literary Icons Gracing This Year's Festival",
    date: "June 19, 2025",
    img: "https://via.placeholder.com/600x360?text=Placeholder+3",
    featured: false,
  },
  // add more posts here — on small screens they'll be horizontally scrollable
];
export default function BlogsAndMedia() {
    const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir = "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  };
  return (
    <div >
   <main className="w-full px-4" style={{ backgroundColor: "#ffffff" }}>
      <div className="px-10 py-10 ">
        {/* top header */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm">Latest News</h3>
          </div>

          <div className="flex items-center gap-3">
            <Button className="rounded-full bg-primary text-black hover:bg-yellow-300">
              View All Post
            </Button>
            <span aria-hidden className="inline-block h-3 w-3 rounded-full bg-primary" />
          </div>
        </div>

        {/* center title */}
        <div className="flex justify-center items-center my-8">
          <h1 className="text-6xl font-extrabold text-center">Blogs and Media</h1>
        </div>

        {/* DESKTOP GRID */}
        <div className="hidden md:grid md:grid-cols-4 md:gap-6">
          {posts.map((p, i) => {
            const isFirst = i === 0;
            return (
              <article
                key={p.id}
                className={`${isFirst ? "md:col-span-2" : "md:col-span-1"} flex flex-col`}
              >
                <div className="relative rounded-lg overflow-hidden bg-gray-100 group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-black/20">
                  <img
                    src={'video.png'}
                    alt={p.title}
                    className={`w-full ${isFirst ? "h-100" : "h-64"} object-cover transition-transform duration-300 group-hover:scale-105`}
                  />
                  <div className="absolute left-4 top-4 text-xs">{p.date}</div>
                  <div className="absolute right-4 bottom-4">
                    <button className="text-xs px-3 py-1 rounded-full bg-primary">
                      Read More
                    </button>
                  </div>
                </div>

                <h2 className="mt-4 text-lg font-semibold">{p.title}</h2>
              </article>
            );
          })}
        </div>

        {/* MOBILE / NARROW: horizontal scroll (carousel-like) */}
        <div className="md:hidden mt-4 relative">
          <div className="flex justify-between items-center mb-3 px-1">
            <button
              onClick={() => scrollBy("left")}
              aria-label="scroll left"
              className="p-1 rounded-full"
            >
              ◀
            </button>
            <button
              onClick={() => scrollBy("right")}
              aria-label="scroll right"
              className="p-1 rounded-full"
            >
              ▶
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {posts.map((p, i) => {
              const isFirst = i === 0;
              return (
                <article
                  key={p.id}
                  className={`snap-start flex-shrink-0 ${
                    isFirst ? "w-[80%]" : "w-[60%]"
                  }`}
                >
                  <div className="relative rounded-lg overflow-hidden bg-gray-100 group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-black/20">
                    <img
                      src={p.img}
                      alt={p.title}
                      className={`w-full ${isFirst ? "h-56" : "h-40"} object-cover transition-transform duration-300 group-hover:scale-105`}
                    />
                    <div className="absolute left-3 top-3 text-xs">{p.date}</div>
                    <div className="absolute right-3 bottom-3">
                      <button className="text-xs px-3 py-1 rounded-full bg-yellow-300">
                        Read More
                      </button>
                    </div>
                  </div>

                  <h2 className="mt-3 text-base font-semibold">{p.title}</h2>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </main>
    </div>
  )
}
