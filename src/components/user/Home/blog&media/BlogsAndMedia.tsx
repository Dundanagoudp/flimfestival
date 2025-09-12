"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getLatestBlogs } from "@/services/blogsServices";
import { format } from "date-fns";
import { BlogPost } from "@/types/blogsTypes";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function BlogsAndMedia() {
  const [blogs, setBlogs] = React.useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const response = await getLatestBlogs();
        console.log("Blogs", response);
        setBlogs(response ?? []);
      } catch (err: any) {
        console.log(err);
        throw new Error(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to get latest blogs"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const latestBlogs = blogs
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.publishedDate).getTime() -
        new Date(a.createdAt || a.publishedDate).getTime()
    )
    .slice(0, 3);
  const items = latestBlogs.slice(0, 3);
  return (
    <div>
      <main className="w-full px-4" style={{ backgroundColor: "#ffffff" }}>
        <div className="px-10 py-10">
          {/* top header */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm">Latest News</h3>
            </div>
            <div className="flex items-center gap-3 hidden md:flex">
              <Link href={"/blogs"}>
                <Button className="rounded-full bg-primary text-black hover:bg-yellow-300 hover:scale-105 hover:shadow-lg transition-all duration-200 ease-out">
                  View All Post
                </Button>
              </Link>
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary animate-pulse hover:animate-bounce cursor-pointer">
                <ArrowRight className="h-3 w-3 text-black" />
              </span>
            </div>
          </div>
          {/* center title */}
          <div className="flex justify-center items-center my-8">
            <h1 className="sm:text-6xl text-3xl font-extrabold text-center">
              Blogs and Media
            </h1>
          </div>
          {/* Mobile-only CTA under title */}
          <div className="md:hidden flex justify-center mb-6">
          <div className="flex items-center ">
              <Link href={"/blogs"}>
                <Button className="rounded-full bg-primary text-black hover:bg-yellow-300 hover:scale-105 hover:shadow-lg transition-all duration-200 ease-out">
                  View All Post
                </Button>
              </Link>
           
            </div>
          </div>
          {/* DESKTOP GRID */}
          <div className="hidden md:flex md:h-[360px] md:gap-6">
            {items.map((blog, i) => {
              const isHovered = hoveredIndex === i;
              // when nothing is hovered, all flex = 1 (equal)
              // when one hovered: hovered ~ 2, others ~ 0.9 (tweak numbers to taste)
              const flexValue = hoveredIndex === null ? 1 : isHovered ? 2 : 0.9;

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
                        style={{
                          transform: isHovered ? "scale(1.04)" : "scale(1)",
                        }}
                      />
                    </Link>

                    <div className="absolute left-4 top-4 text-xs">
                      {format(
                        new Date(blog.publishedDate || blog.createdAt),
                        "MMM d, yyyy"
                      )}
                    </div>

                    <div className="absolute right-4 bottom-4">
                      <button className="text-xs px-3 py-1 rounded-full bg-primary">
                        Read More
                      </button>
                    </div>
                  </div>

                  <h2 className="mt-4 text-lg font-semibold truncate">
                    {blog.title}
                  </h2>
                </article>
              );
            })}
          </div>
          {/* MOBILE / NARROW: Swiper slider */}
          <div className="md:hidden mt-4">
            <Swiper
              modules={[Pagination]}
              spaceBetween={12}
              slidesPerView={1.1}
              pagination={{ clickable: true }}
              style={{ paddingBottom: 24 }}
            >
              {latestBlogs.map((blog) => (
                <SwiperSlide key={blog._id}>
                  <article>
                    <div className="relative rounded-lg overflow-hidden bg-gray-100 group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-black/20">
                      <img
                        src={blog.imageUrl || "default-image.png"}
                        alt={blog.title}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute left-3 top-3 text-xs">
                        {format(
                          new Date(blog.publishedDate || blog.createdAt),
                          "MMM d, yyyy"
                        )}
                      </div>
                      <div className="absolute right-3 bottom-3">
                        <button className="text-xs px-3 py-1 rounded-full bg-yellow-300">
                          Read More
                        </button>
                      </div>
                    </div>
                    <h2 className="mt-3 text-base font-semibold">{blog.title}</h2>
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </main>
    </div>
  );
}
