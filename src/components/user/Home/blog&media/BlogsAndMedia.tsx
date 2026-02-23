"use client";
import React, { useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { getLatestBlogs } from "@/services/blogsServices";
import { format } from "date-fns";
import { BlogPost } from "@/types/blogsTypes";
import Link from "next/link";
import { getMediaUrl } from "@/utils/media";

function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md lg:h-[450px] animate-pulse">
      <div className="p-2">
        <div className="w-full h-72 bg-gray-200 rounded-xl mb-4" />
        <div className="h-5 bg-gray-200 rounded w-3/4 mt-4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
        <div className="flex justify-between mt-9">
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function BlogsAndMedia() {
  const [blogs, setBlogs] = React.useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const response = await getLatestBlogs();
        setBlogs(response ?? []);
      } catch (err: any) {
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

  return (
    <div className="min-h-screen bg-white pt-4 px-6 md:px-8 pb-6 relative overflow-hidden">
      {/* Header */}
      <div className="text-center mt-4 mb-8 relative z-10">
        <div className="flex justify-center items-center gap-6">
          <div className="w-4 h-4 rounded-full bg-primary" />
          <h2 className="text-primary text-2xl md:text-4xl lg:text-5xl font-bold uppercase tracking-wide">
            Blogs and Media
          </h2>
          <div className="w-4 h-4 rounded-full bg-primary" />
        </div>
      </div>

      {/* View All Button */}
      <div className="flex justify-center mb-8 relative z-10">
        <Link href="/blogs" className="group relative flex items-center hover:scale-105 transition-transform duration-300 focus:outline-none">
          <span className="bg-primary text-primary-foreground px-8 py-3 rounded-full text-lg font-medium">
            View All
          </span>
          <span className="absolute right-0 left-28 translate-x-1/2 bg-primary w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:translate-x-6 group-hover:rotate-12">
            <ArrowUpRight className="w-4 h-4 text-primary-foreground transition-transform duration-300 group-hover:rotate-45" />
          </span>
        </Link>
      </div>

      {/* Blog Cards or Skeletons */}
      <div
        className="grid gap-6 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
      >
        {isLoading ? (
          <>
            <BlogCardSkeleton />
            <BlogCardSkeleton />
            <BlogCardSkeleton />
          </>
        ) : latestBlogs.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">No blogs found.</div>
        ) : (
          latestBlogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-xl overflow-hidden shadow-md lg:h-[450px] group"
            >
              <div className="p-2">
                <div className="relative w-full h-72 mb-4 flex-shrink-0 overflow-hidden rounded-xl">
                  <Link href={`/blogs/${blog._id}`}>
                    <img
                      src={getMediaUrl(blog.imageUrl) || "/blogs/blog1.png"}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </Link>
                </div>
                <h3 className="text-xl font-bold mt-4 mb-2 truncate" title={blog.title}>
                  {blog.title}
                </h3>
                {blog.contents && (
                  <p className="text-gray-700 text-base mb-2 truncate" title={blog.contents}>
                    {blog.contents.length > 40 ? blog.contents.slice(0, 40) + "…" : blog.contents}
                  </p>
                )}
                <div className="flex justify-between items-center mt-9">
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                    {blog.publishedDate
                      ? new Date(blog.publishedDate).getFullYear()
                      : blog.createdAt
                        ? new Date(blog.createdAt).getFullYear()
                        : new Date().getFullYear()}
                  </span>
                  {blog.contentType === "link" && blog.link ? (
                    <a
                      href={blog.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-semibold hover:underline text-sm sm:text-base"
                    >
                      Read More
                    </a>
                  ) : (
                    <Link
                      href={`/blogs/${blog._id}`}
                      className="text-primary font-semibold hover:underline text-sm sm:text-base"
                    >
                      Read More
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
