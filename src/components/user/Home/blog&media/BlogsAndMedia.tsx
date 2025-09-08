'use client'
import React, { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getLatestBlogs } from '@/services/blogsServices';
import { format } from 'date-fns';
import { BlogPost } from '@/types/blogsTypes';
import Link from 'next/link';







export default function BlogsAndMedia() {
  const [blogs, setBlogs] = React.useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
    useEffect(() => {
      const fetchBlogs = async () => {
        setIsLoading(true);
        try{
          const response  = await getLatestBlogs();
          console.log("Blogs",response)
          setBlogs(response ?? []);
          
        }
        catch(err:any){
          console.log(err)
          throw new Error(err?.response?.data?.message || err?.message || "Failed to get latest blogs")
        }
        finally {
          setIsLoading(false);
        }
      };
      fetchBlogs();
    }, []);

    const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir = "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  };
  const latestBlogs = blogs
  .slice()
  .sort((a, b) => new Date(b.createdAt || b.publishedDate).getTime() - new Date(a.createdAt || a.publishedDate).getTime())
  .slice(0, 3);
const items = latestBlogs.slice(0, 3);
  return (
    <div >
     <main className="w-full px-4" style={{ backgroundColor: "#ffffff" }}>
    <div className="px-10 py-10">
      {/* top header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm">Latest News</h3>
        </div>
        <div className="flex items-center gap-3">
          <Link href={'/blogs'}>
          <Button className="rounded-full bg-primary text-black hover:bg-yellow-300">
            View All Post
          </Button></Link>
          <span aria-hidden className="inline-block h-3 w-3 rounded-full bg-primary" />
        </div>
      </div>
      {/* center title */}
      <div className="flex justify-center items-center my-8">
        <h1 className="text-6xl font-extrabold text-center">Blogs and Media</h1>
      </div>
      {/* DESKTOP GRID */}
  <div className="hidden md:flex md:h-[360px] md:gap-6">
      {items.map((blog, i) => {
        const isHovered = hoveredIndex === i;
        // when nothing is hovered, all flex = 1 (equal)
        // when one hovered: hovered ~ 2, others ~ 0.9 (tweak numbers to taste)
        const flexValue =
          hoveredIndex === null ? 1 : isHovered ? 2 : 0.9;

        return (
          <article
            key={blog._id}
            className="flex flex-col h-full transition-all duration-500"
            style={{ flex: flexValue, minWidth: 0 }} // minWidth:0 avoids img overflow
          >
            <div
              role="button"
              tabIndex={0}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onFocus={() => setHoveredIndex(i)}
              onBlur={() => setHoveredIndex(null)}
              className="relative rounded-lg overflow-hidden bg-gray-100 cursor-pointer shadow-sm transition-shadow duration-300 flex-1"
            >
              {/* image wrapper keeps full height */}
              <Link href={`/blogs/${blog._id}`}>
              <img
                src={blog.imageUrl || "default-image.png"}
                alt={blog.title}
                loading="lazy"
                className={`w-full h-full object-cover transition-transform duration-500`}
                // small scale-up on the hovered item for extra punch:
                style={{ transform: isHovered ? "scale(1.04)" : "scale(1)" }}
              /></Link>

              <div className="absolute left-4 top-4 text-xs">
                {format(new Date(blog.publishedDate || blog.createdAt), "MMM d, yyyy")}
              </div>

              <div className="absolute right-4 bottom-4">
                <button className="text-xs px-3 py-1 rounded-full bg-primary">
                  Read More
                </button>
              </div>
            </div>

            <h2 className="mt-4 text-lg font-semibold truncate">{blog.title}</h2>
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
          {latestBlogs.map((blog, i) => {
            const isFirst = i === 0;
            return (
              <article
                key={blog._id}
                className={`snap-start flex-shrink-0 ${
                  isFirst ? "w-[80%]" : "w-[60%]"
                }`}
              >
                <div className="relative rounded-lg overflow-hidden bg-gray-100 group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-black/20">
                  <img
                    src={blog.imageUrl || 'default-image.png'}
                    alt={blog.title}
                    className={`w-full ${isFirst ? "h-56" : "h-40"} object-cover transition-transform duration-300 group-hover:scale-105`}
                  />
                  <div className="absolute left-3 top-3 text-xs">
                    {format(new Date(blog.publishedDate || blog.createdAt), 'MMM d, yyyy')}
                  </div>
                  <div className="absolute right-3 bottom-3">
                    <button className="text-xs px-3 py-1 rounded-full bg-yellow-300">
                      Read More
                    </button>
                  </div>
                </div>
                <h2 className="mt-3 text-base font-semibold">{blog.title}</h2>
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
