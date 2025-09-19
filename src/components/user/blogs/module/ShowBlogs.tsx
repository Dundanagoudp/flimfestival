'use client'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getAllBlogs } from '@/services/blogsServices'
import React, { useEffect, useState } from 'react'
import type { BlogPost } from '@/types/blogsTypes'
import { Badge } from '@/components/ui/badge'
import Reveal from '@/components/common/Reveal'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'

export default function ShowBlogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"blog" | "link">("blog")

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true)
      const response = await getAllBlogs()
      setBlogs(response)
      setIsLoading(false)
    }
    fetchBlogs()
  }, [])
  return (
    <div>
  <main className="w-full px-4" style={{ backgroundColor: "#ffffff" }}>
  <div className="px-10 py-10">
    {isLoading ? (
      // Skeleton Layout
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="hover:scale-105 transition-all duration-300 ease-out">
            <div className="relative w-full h-[277px] rounded-[10px] bg-gray-100 border border-gray-200 overflow-hidden shadow-sm">
              <Skeleton className="w-full h-full rounded-[10px]" />
            </div>
            <div className="p-4">
              <Skeleton className="h-[20px] w-full rounded-lg mb-2" />
              <Skeleton className="h-[16px] w-[100px] rounded-full" />
            </div>
            <div className="px-4 pt-0 flex justify-end">
              <Skeleton className="h-[36px] w-[120px] rounded-md" />
            </div>
          </div>
        ))}
      </div>
    ) : (
      // Actual Content Layout
      <>
        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(["blog", "link"] as const).map((tab) => {
              const isActive = activeTab === tab
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  <span>{tab === "blog" ? "Blog" : "Link"}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {blogs
          .filter((b) => b.contentType === activeTab)
          .map((blog, index) => {
          const categoryName = typeof blog.category === 'string' ? blog.category : blog.category?.name;
          return (
            <Reveal key={blog._id} pop y={16} delay={0.05 + index * 0.06}>
              <Card className="cursor-pointer hover:scale-105 transition-all duration-300 ease-out">
                <CardContent className="p-0">
                  <div className="relative w-full h-[277px] rounded-[10px] bg-gray-100 border border-gray-200 overflow-hidden shadow-sm">
                    {categoryName && (
                      <Badge className="absolute top-2 left-2">{categoryName}</Badge>
                    )}
                    <img
                      src={blog.imageUrl || '/video.png'}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                      draggable="false"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-semibold">{blog.title}</h3>
                    <p className="text-sm text-gray-500">By {blog.author}</p>
                  </div>
                </CardContent>
                <CardFooter className="px-4 pt-0 flex justify-end">
                  {blog.contentType === 'blog' ? (
                    <Button asChild size="sm" className="w-1/2">
                      <Link href={`/blogs/${blog._id}`}>Read More</Link>
                    </Button>
                  ) : (
                    <Button asChild size="sm" className="w-1/2">
                      <a href={blog.link || '#'} target="_blank" rel="noopener noreferrer">Open Link</a>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </Reveal>
          );
        })}
        {blogs.filter((b) => b.contentType === activeTab).length === 0 && (
          <div className="col-span-full flex justify-center items-center py-20">
            <p className="text-gray-500 text-lg">No {activeTab === 'blog' ? 'blog posts' : 'links'} available</p>
          </div>
        )}
      </div>
      </>
    )}
  </div>
</main>


    </div>
  )
}
