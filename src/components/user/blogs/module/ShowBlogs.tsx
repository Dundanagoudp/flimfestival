'use client'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getAllBlogs } from '@/services/blogsServices'
import React, { useEffect, useState } from 'react'
import type { BlogPost } from '@/types/blogsTypes'
import { Badge } from '@/components/ui/badge'
import Reveal from '@/components/common/Reveal'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { getMediaUrl } from '@/utils/media'
import { sanitizeUrl } from '@/lib/sanitize'
import { ArrowUpRight } from 'lucide-react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

const BLOGS_PER_PAGE = 9

// Shimmer effect component
const ShimmerEffect = ({ className }: { className?: string }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <div className="bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300 bg-[length:200%_100%] animate-shimmer rounded h-full w-full" />
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer rounded h-full w-full" />
  </div>
)

const BlogCardShimmer = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow-md">
    <div className="p-3 sm:p-4">
      <div className="relative w-full h-48 sm:h-56 lg:h-64 mb-3 sm:mb-4 overflow-hidden rounded-lg">
        <ShimmerEffect className="w-full h-full" />
      </div>
      <div className="space-y-3 mb-4">
        <ShimmerEffect className="h-6 sm:h-7 w-4/5" />
        <ShimmerEffect className="h-6 sm:h-7 w-3/5" />
      </div>
      <div className="flex justify-between items-center mt-4 sm:mt-6">
        <ShimmerEffect className="h-4 sm:h-5 w-1/3" />
        <ShimmerEffect className="h-4 sm:h-5 w-1/4" />
      </div>
    </div>
  </div>
)

const HeaderShimmer = () => (
  <div className="text-center my-8 sm:my-12 lg:my-16 relative z-10">
    <ShimmerEffect className="h-12 sm:h-16 lg:h-20 w-32 sm:w-48 lg:w-56 mx-auto rounded-xl" />
  </div>
)

const SearchBarShimmer = () => (
  <div className="max-w-2xl mx-auto mb-8 sm:mb-12 lg:mb-16 relative z-10 flex flex-col items-center px-4">
    <div className="w-full flex flex-col sm:flex-row gap-4 items-center">
      <ShimmerEffect className="flex-1 w-full h-12 sm:h-14 lg:h-16 rounded-xl" />
    </div>
    <div className="mt-4 sm:mt-6 flex items-center">
      <ShimmerEffect className="h-10 sm:h-12 lg:h-14 w-24 sm:w-32 lg:w-36 rounded-full" />
    </div>
  </div>
)

const SectionTitleShimmer = () => (
  <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8 relative z-10 text-center">
    <ShimmerEffect className="h-6 sm:h-8 lg:h-10 w-40 sm:w-56 lg:w-64 mx-auto rounded-xl" />
  </div>
)

export default function ShowBlogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'blog' | 'link'>('blog')
  const [searchTerm, setSearchTerm] = useState('')
  const [pendingSearchTerm, setPendingSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [availableYears, setAvailableYears] = useState<number[]>([])

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true)
      const response = await getAllBlogs()
      setBlogs(response)
      setIsLoading(false)
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const blogOnly = blogs.filter((b) => b.contentType === 'blog')
    const years = blogOnly
      .map((b) => {
        try {
          const y = new Date(b.publishedDate || 0).getFullYear()
          return y > 1900 ? y : null
        } catch {
          return null
        }
      })
      .filter((y): y is number => y != null)
    const unique = [...new Set(years)].sort((a, b) => b - a)
    setAvailableYears(unique)
    if (unique.length && !selectedYear) setSelectedYear(String(unique[0]))
  }, [blogs, selectedYear])

  const getImageUrl = (image: string) => getMediaUrl(image)

  const filteredBlogs = React.useMemo(() => {
    let list = blogs.filter((b) => b.contentType === activeTab)
    if (activeTab === 'blog') {
      if (searchTerm.trim()) {
        list = list.filter((b) =>
          b.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      if (selectedYear) {
        const y = parseInt(selectedYear, 10)
        list = list.filter((b) => {
          try {
            return new Date(b.publishedDate || 0).getFullYear() === y
          } catch {
            return false
          }
        })
      }
    }
    return [...list].sort((a, b) => {
      const da = new Date(a.publishedDate || 0).getTime()
      const db = new Date(b.publishedDate || 0).getTime()
      return db - da
    })
  }, [blogs, activeTab, searchTerm, selectedYear])

  const totalPages = Math.ceil(filteredBlogs.length / BLOGS_PER_PAGE)
  const indexOfLast = currentPage * BLOGS_PER_PAGE
  const indexOfFirst = indexOfLast - BLOGS_PER_PAGE
  const currentBlogs = filteredBlogs.slice(indexOfFirst, indexOfLast)

  const handlePageChange = (page: number) => setCurrentPage(page)
  const handleYearChange = (year: string) => {
    setSelectedYear(year)
    setCurrentPage(1)
  }

  useEffect(() => {
    if (pendingSearchTerm === '') {
      setSearchTerm('')
      setCurrentPage(1)
    }
  }, [pendingSearchTerm])

  return (
    <main className="min-h-screen bg-white p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto relative z-10">
        {isLoading ? (
          <>
            <HeaderShimmer />
            <SearchBarShimmer />
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
              <div className="flex justify-center">
                <ShimmerEffect className="h-12 w-96 rounded-xl" />
              </div>
            </div>
            <SectionTitleShimmer />
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
              {[...Array(9)].map((_, i) => (
                <BlogCardShimmer key={i} />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="text-center my-8 sm:my-12 lg:my-16">
              <h1 className="text-blue-900 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat">
                BLOGS
              </h1>
            </div>

            <div className="max-w-2xl mx-auto mb-8 sm:mb-12 lg:mb-16 flex flex-col items-center px-4">
              <div className="w-full flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1 w-full">
                  <Input
                    type="text"
                    placeholder="Search by Blog Name"
                    value={pendingSearchTerm}
                    onChange={(e) => setPendingSearchTerm(e.target.value)}
                    className="w-full pl-4 pr-4 py-4 sm:py-6 lg:py-7 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-base sm:text-lg bg-transparent"
                  />
                </div>
              </div>
              <div className="mt-4 sm:mt-6 flex items-center">
                <button
                  type="button"
                  className="group relative flex items-center hover:scale-105 transition-transform duration-300 focus:outline-none"
                  onClick={() => {
                    setSearchTerm(pendingSearchTerm)
                    setCurrentPage(1)
                  }}
                >
                  <span
                    className="bg-primary text-primary-foreground px-8 py-2 rounded-full text-lg font-medium text-center font-montserrat"
                  >
                    Search
                  </span>
                  <span
                    className="absolute right-0 left-25 translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:translate-x-6 group-hover:rotate-12 bg-primary text-primary-foreground"
                  >
                    <ArrowUpRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:rotate-45" />
                  </span>
                </button>
              </div>
            </div>

            <div className="flex justify-center mb-8">
              <div className="flex bg-gray-100 rounded-lg p-1">
                {(['blog', 'link'] as const).map((tab) => {
                  const isActive = activeTab === tab
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                      }`}
                    >
                      <span>{tab === 'blog' ? 'Blog' : 'Link'}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {activeTab === 'blog' && (
              <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
                <div className="flex justify-center">
                  <div
                    className="rounded-lg px-4 sm:px-6 py-4 flex items-center space-x-4 sm:space-x-6 overflow-x-auto scrollbar-hide"
                    style={{
                      backgroundColor: '#ffffff',
                      minWidth: '280px',
                      maxWidth: '100%',
                    }}
                  >
                    {availableYears.map((year) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => handleYearChange(String(year))}
                        className="relative group transition-all duration-200 whitespace-nowrap flex-shrink-0 px-2 md:px-3"
                      >
                        <span
                          className={`text-lg font-medium transition-colors duration-200 ${
                            selectedYear === String(year)
                              ? 'text-primary'
                              : 'text-gray-600 group-hover:text-gray-800'
                          }`}
                        >
                          {year}
                        </span>
                        <div
                          className={`absolute -bottom-4 left-0 right-0 rounded-full transition-all duration-300 ${
                            selectedYear === String(year)
                              ? 'h-1 bg-primary'
                              : 'h-px bg-gray-400'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8 text-center">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 font-montserrat">
                {activeTab === 'blog' ? 'Latest Blogs' : 'Links'}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
              {currentBlogs.map((blog, idx) => {
                const categoryName =
                  typeof blog.category === 'string'
                    ? blog.category
                    : blog.category?.name
                const isBlog = blog.contentType === 'blog'
                const cardContent = (
                  <Card className="bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105 h-full flex flex-col cursor-pointer">
                    <CardContent className="p-0 flex flex-col flex-1">
                      <div className="relative w-full h-48 sm:h-56 lg:h-64 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden">
                        {categoryName && (
                          <Badge className="absolute top-2 left-2 z-10">
                            {categoryName}
                          </Badge>
                        )}
                        <img
                          src={getImageUrl(blog.imageUrl) || '/video.png'}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          draggable={false}
                          loading="lazy"
                        />
                      </div>
                      <div className="p-3 sm:p-4 flex flex-col flex-1">
                        <h3 className="text-lg sm:text-xl font-bold mt-3 sm:mt-4 mb-1 line-clamp-1 font-montserrat">
                          {blog.title.length > 40
                            ? `${blog.title.substring(0, 40)}...`
                            : blog.title}
                        </h3>
                        <p className="text-gray-500 text-xs sm:text-sm flex-1 line-clamp-2 mb-0 font-montserrat">
                          {blog.contents && blog.contents.length > 120
                            ? `${blog.contents.substring(0, 120)}...`
                            : blog.contents || ''}
                        </p>
                        <div className="flex justify-between items-center mt-2 sm:mt-2">
                          <span
                            className="px-3 py-1 text-white text-xs sm:text-sm font-medium rounded-full font-montserrat"
                            style={{ backgroundColor: '#4F8049' }}
                          >
                            {blog.publishedDate
                              ? new Date(blog.publishedDate).getFullYear()
                              : new Date().getFullYear()}
                          </span>
                          {isBlog ? (
                            <span className="font-semibold text-sm sm:text-base font-montserrat text-primary">
                              Read More
                            </span>
                          ) : (
                            <span className="font-semibold text-sm sm:text-base font-montserrat text-primary">
                              Open Link
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
                return (
                  <Reveal key={blog._id} pop y={16} delay={0.05 + idx * 0.06}>
                    {isBlog ? (
                      <Link href={`/blogs/${blog._id}`} className="block h-full">
                        {cardContent}
                      </Link>
                    ) : (
                      <a
                        href={sanitizeUrl(blog.link || '') || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-full"
                      >
                        {cardContent}
                      </a>
                    )}
                  </Reveal>
                )
              })}
            </div>

            {filteredBlogs.length === 0 && (
              <div className="col-span-full flex justify-center items-center py-20">
                <p className="text-gray-500 text-lg font-montserrat">
                  No {activeTab === 'blog' ? 'blog posts' : 'links'} available
                </p>
              </div>
            )}

            {!isLoading && totalPages > 1 && (
              <div className="mt-8 sm:mt-12 lg:mt-16 px-4">
                <Pagination>
                  <PaginationContent className="flex flex-wrap justify-center gap-1 sm:gap-2">
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          handlePageChange(
                            currentPage > 1 ? currentPage - 1 : 1
                          )
                        }}
                        className="text-sm sm:text-base"
                      />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === i + 1}
                          onClick={(e) => {
                            e.preventDefault()
                            handlePageChange(i + 1)
                          }}
                          className="text-sm sm:text-base min-w-[2rem] sm:min-w-[2.5rem] font-montserrat"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          handlePageChange(
                            currentPage < totalPages
                              ? currentPage + 1
                              : totalPages
                          )
                        }}
                        className="text-sm sm:text-base"
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
