"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  getAllBlogs,
  getSingleBlog,
  getLatestBlogs,
} from "@/services/blogsServices";
import { BlogPost } from "@/types/blogsTypes";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Reveal from "@/components/common/Reveal";
import { useParams } from "next/navigation";
import formatShortDate from "@/components/common/FormateDate";
import { Skeleton } from "@/components/ui/skeleton";
import { getMediaUrl } from "@/utils/media";
import { sanitizeHtml } from "@/lib/sanitize";

export default function ShowBlogById() {
  const { id } = useParams<{ id: string }>();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [blog, setBlog] = useState<BlogPost>();
  const [isLoading, setIsLoading] = useState(true);
  const getImageUrl = (image: string) => {
    return getMediaUrl(image);
  }
  useEffect(() => {
    const fetchBlog = async () => {
      setIsLoading(true);
      const response = await getSingleBlog(id);
      setBlog(response);
      setIsLoading(false);
    };
    fetchBlog();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const latest = await getLatestBlogs();
        setBlogs(latest);
        setIsLoading(false);
      } catch (e) {
        try {
          const all = await getAllBlogs();
          setBlogs(all);
        } catch (err) {
          setBlogs([]);
          setIsLoading(false);
        }
      }
    };
    fetchBlogs();
  }, []);

  const formatDate = (isoDate: string | undefined) => {
    if (!isoDate) return "";
    return new Date(isoDate).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  return (
    <div>
     <main className="max-w-7xl mx-auto px-4 py-8">
  {isLoading ? (
    // Skeleton Layout
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content Skeleton */}
      <div className="lg:col-span-2">
        <article className="space-y-8">
          {/* Featured Image Skeleton */}
          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            <Skeleton className="w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl bg-gray-100" />
            <div className="absolute bottom-6 left-6 right-6">
              <Skeleton className="inline-flex items-center h-[36px] w-[150px] rounded-full bg-gray-100" />
            </div>
          </div>

          {/* Article Header Skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-[40px] w-full max-w-[600px] rounded-lg bg-gray-100" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-[20px] w-[100px] rounded-full bg-gray-100" />
              <Skeleton className="h-[20px] w-[120px] rounded-full bg-gray-100" />
            </div>
          </div>

          {/* Article Content Skeleton */}
          <div className="p-6 lg:p-8 shadow-sm border-0 bg-white/70 backdrop-blur-sm rounded-lg">
            <div className="space-y-4">
              <Skeleton className="h-[20px] w-full rounded-lg bg-gray-100" />
              <Skeleton className="h-[20px] w-full rounded-lg bg-gray-100" />
              <Skeleton className="h-[20px] w-[80%] rounded-lg bg-gray-100" />
            </div>
          </div>
        </article>
      </div>

      {/* Sidebar Skeleton */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <Skeleton className="h-[28px] w-[150px] mb-4 rounded-lg bg-gray-100" />

          <div className="flex flex-col gap-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded-md">
                <Skeleton className="w-12 h-12 rounded-md bg-gray-100" />
                <div className="min-w-0 space-y-2">
                  <Skeleton className="h-[16px] w-[200px] rounded-full bg-gray-100" />
                  <Skeleton className="h-[14px] w-[100px] rounded-full bg-gray-100" />
                </div>
              </div>
            ))}
          </div>

          <Skeleton className="mt-4 h-[24px] w-[120px] rounded-lg bg-gray-100" />
        </div>
      </div>
    </div>
  ) : (
    // Actual Content Layout
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2">
        <article className="space-y-8">
          {/* Featured Image */}
          {blog?.imageUrl && (
            <div className="relative group overflow-hidden rounded-2xl shadow-lg">
              <img
                src={getImageUrl(blog?.imageUrl)}
                alt={blog?.title}
                className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  Featured Article
                </span>
              </div>
            </div>
          )}
          {/* Article Header */}
          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold mt-6">{blog?.title}</h1>
            <div className="flex items-center gap-4 text-gray-600 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">By {blog?.author || "Anonymous"}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>
                  {blog?.publishedDate ? formatDate(blog?.publishedDate) : "Unknown date"}
                </span>
              </div>
            </div>
          </div>
          {/* Article Content */}
          <div className="p-6 lg:p-8 shadow-sm border-0 bg-white/70 backdrop-blur-sm rounded-lg">
            <div
              className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(blog?.contents ?? "") }}
            />
          </div>
        </article>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-lg font-semibold mb-4">Latest Posts</h2>
          <div className="flex flex-col gap-3">
            {(blogs || []).slice(0, 5).map((b, index) => (
              <Reveal key={b?._id} pop y={16} delay={0.05 + index * 0.06}>
                <Link
                  className="flex items-center gap-3 rounded-md border p-2 hover:scale-[1.02] hover:shadow-sm transition-all duration-200 ease-out"
                  href={`/blogs/${b._id}`}
                >
                  <div className="w-12 h-12 rounded-md bg-gray-100 overflow-hidden flex-shrink-0">
                    <img
                      src={getImageUrl(b.imageUrl)}
                      className="w-full h-full object-cover"
                      alt={b.title}
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium truncate">{b.title}</h3>
                    <p className="text-xs text-gray-600">
                      {formatShortDate(b.publishedDate)}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <Link
            href="/blogs"
            className="mt-4 inline-flex items-center gap-1 text-sm text-primary font-medium"
          >
            View all articles
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )}
</main>

    </div>
  );
}
