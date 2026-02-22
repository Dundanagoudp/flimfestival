"use client";
import { Card } from "@/components/ui/card";
import {
  getAllBlogs,
  getSingleBlog,
  getLatestBlogs,
} from "@/services/blogsServices";
import { BlogPost } from "@/types/blogsTypes";
import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Reveal from "@/components/common/Reveal";
import { useParams } from "next/navigation";
import formatShortDate from "@/components/common/FormateDate";
import { Skeleton } from "@/components/ui/skeleton";
import { getMediaUrl } from "@/utils/media";
import { sanitizeHtml } from "@/lib/sanitize";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Search, ArrowRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function ShowBlogById() {
  const { id } = useParams<{ id: string }>();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [blog, setBlog] = useState<BlogPost>();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFullContent, setShowFullContent] = useState(false);

  const getImageUrl = (image: string) => getMediaUrl(image);

  const filteredBlogs = useMemo(() => {
    const list = (blogs || []).filter((b) => b._id !== id);
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (b) =>
        b.title?.toLowerCase().includes(q) ||
        b.contents?.toLowerCase().includes(q) ||
        b.author?.toLowerCase().includes(q)
    );
  }, [blogs, searchQuery, id]);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await getSingleBlog(id);
        setBlog(response);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const latest = await getLatestBlogs();
        setBlogs(latest);
      } catch {
        try {
          const all = await getAllBlogs();
          setBlogs(all);
        } catch {
          setBlogs([]);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <article className="space-y-8">
                <div className="relative overflow-hidden rounded-2xl shadow-lg">
                  <Skeleton className="w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl bg-gray-100" />
                </div>
                <div className="space-y-6">
                  <Skeleton className="h-[40px] w-full max-w-[600px] rounded-lg bg-gray-100" />
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-[20px] w-[100px] rounded-full bg-gray-100" />
                    <Skeleton className="h-[20px] w-[120px] rounded-full bg-gray-100" />
                  </div>
                </div>
                <div className="p-6 lg:p-8 shadow-sm border-0 bg-white/70 backdrop-blur-sm rounded-lg">
                  <div className="space-y-4">
                    <Skeleton className="h-[20px] w-full rounded-lg bg-gray-100" />
                    <Skeleton className="h-[20px] w-full rounded-lg bg-gray-100" />
                    <Skeleton className="h-[20px] w-[80%] rounded-lg bg-gray-100" />
                  </div>
                </div>
              </article>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <Skeleton className="h-[28px] w-[150px] mb-4 rounded-lg bg-gray-100" />
                <div className="flex flex-col gap-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-md">
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
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 font-montserrat">
            Blog Not Found
          </h2>
          <p className="text-gray-600 mb-6 font-montserrat">
            The requested blog post could not be found.
          </p>
          <Button asChild className="bg-primary hover:opacity-90 font-montserrat text-primary-foreground">
            <Link href="/blogs">Browse All Blogs</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const contents = blog.contents ?? "";
  const hasLongContent = contents.length > 500;

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full px-4 md:px-8 pt-4 pb-2 bg-white">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/blogs">Blogs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-montserrat truncate max-w-[200px] sm:max-w-none">
                {blog.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <article className="space-y-8">
              {blog.imageUrl && (
                <div className="relative group overflow-hidden rounded-2xl shadow-lg">
                  <img
                    src={getImageUrl(blog.imageUrl)}
                    alt={blog.title}
                    className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
              )}

              <div className="space-y-6">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight font-montserrat">
                  {blog.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-gray-600 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-gray-800 font-montserrat">
                      {blog.publishedDate
                        ? formatDate(blog.publishedDate)
                        : "Unknown date"}
                    </span>
                  </div>
                </div>
              </div>

              <Card className="p-6 lg:p-8 shadow-sm border-0 bg-white/70 backdrop-blur-sm">
                <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed font-montserrat">
                  <div
                    className={
                      hasLongContent && !showFullContent
                        ? "max-h-[420px] overflow-hidden relative"
                        : ""
                    }
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(contents),
                      }}
                      className="text-lg text-justify leading-8"
                    />
                    {hasLongContent && !showFullContent && (
                      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/90 to-transparent pointer-events-none" />
                    )}
                  </div>
                  {hasLongContent && (
                    <div className="mt-6 flex justify-end">
                      <Button
                        type="button"
                        onClick={() => setShowFullContent(!showFullContent)}
                        className="bg-primary text-primary-foreground hover:opacity-90 border-0 px-6 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 font-montserrat"
                      >
                        {showFullContent ? (
                          <>
                            <span>Show Less</span>
                            <ArrowRight className="w-4 h-4 ml-2 rotate-180" />
                          </>
                        ) : (
                          <>
                            <span>Read More</span>
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </article>
          </div>

          <div className="space-y-6">
            <Card className="p-4 shadow-sm border-0 bg-white/70 backdrop-blur-sm">
              <form onSubmit={handleSearch} className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search blogs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-3 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:opacity-90 py-3 rounded-lg transition-colors font-montserrat"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </form>
            </Card>

            <Card className="p-6 shadow-sm border-0 bg-white/70 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900 font-montserrat">
                  {searchQuery.trim()
                    ? `Search Results (${filteredBlogs.length})`
                    : "Latest Posts"}
                </h2>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredBlogs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 font-montserrat">
                    {searchQuery.trim()
                      ? "No blogs found matching your search."
                      : "No other blogs available."}
                  </div>
                ) : (
                  filteredBlogs
                    .filter((b) => b.contentType === "blog")
                    .sort(
                      (a, b) =>
                        new Date(b.publishedDate ?? 0).getTime() -
                        new Date(a.publishedDate ?? 0).getTime()
                    )
                    .slice(0, searchQuery.trim() ? 10 : 5)
                    .map((b) => (
                      <Link
                        key={b._id}
                        href={`/blogs/${b._id}`}
                        className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200 group"
                      >
                        <div className="flex-shrink-0 relative overflow-hidden rounded-lg w-16 h-16">
                          <img
                            src={getImageUrl(b.imageUrl) || "/video.png"}
                            alt={b.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 flex items-center gap-1 mb-1 font-montserrat">
                            <Calendar className="w-3 h-3" />
                            {b.publishedDate
                              ? formatShortDate(b.publishedDate)
                              : "Unknown"}
                          </p>
                          <h3 className="text-sm font-medium text-gray-900 leading-tight line-clamp-2 group-hover:text-primary transition-colors font-montserrat">
                            {b.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1 font-montserrat">
                            By {b.author || "Anonymous"}
                          </p>
                        </div>
                      </Link>
                    ))
                )}
              </div>

              {!searchQuery.trim() && (
                <Button
                  asChild
                  variant="ghost"
                  className="w-full mt-4 text-primary hover:opacity-90 hover:bg-primary/10 transition-colors font-montserrat"
                >
                  <Link href="/blogs" className="inline-flex items-center gap-2">
                    View all articles
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
