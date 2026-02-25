"use client"

import { useState, useEffect } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { VideoSkeleton } from "./module/video-skeleton"
import { VideoCard } from "./module/video-card"
import { getYoutubeVideos, getRawVideos } from "@/services/videosServices"
import type { VideoBlog } from "@/types/videosTypes"
import { useToast } from "@/components/ui/custom-toast"
import { format } from "date-fns"
import Link from "next/link"
import { getThumbnailUrl } from "@/utils/media"
import VideoHero from "./module/VideoHero"

function getYouTubeVideoId(url: string = "") {
  return url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1] || ""
}

export default function Videosection() {
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState<"youtube" | "uploaded">("youtube")
  const [youtubeVideos, setYoutubeVideos] = useState<VideoBlog[]>([])
  const [uploadedVideos, setUploadedVideos] = useState<VideoBlog[]>([])
  const { showToast } = useToast()
  const videosPerPage = 12
  const videos = activeTab === "youtube" ? youtubeVideos : uploadedVideos
  const totalPages = Math.ceil(videos.length / videosPerPage)

  useEffect(() => {
    const fetchAllVideos = async () => {
      setLoading(true)
      try {
        const youtubeRes = await getYoutubeVideos()
        if (youtubeRes.success && youtubeRes.data) {
          setYoutubeVideos(youtubeRes.data)
        } else {
          showToast(youtubeRes.error || "Failed to fetch YouTube videos", "error")
        }

        const uploadedRes = await getRawVideos()
        if (uploadedRes.success && uploadedRes.data) {
          setUploadedVideos(uploadedRes.data)
        } else {
          showToast(uploadedRes.error || "Failed to fetch uploaded videos", "error")
        }
      } catch {
        showToast("Failed to fetch videos", "error")
      } finally {
        setLoading(false)
      }
    }
    fetchAllVideos()
  }, [showToast])

  useEffect(() => {
    if (activeTab === "uploaded" && uploadedVideos.length === 0) {
      setActiveTab("youtube")
    }
  }, [activeTab, uploadedVideos.length])

  const getCurrentVideos = () => {
    const startIndex = (currentPage - 1) * videosPerPage
    const endIndex = startIndex + videosPerPage
    return videos.slice(startIndex, endIndex)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFF8ED" }}>
      <VideoHero />
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-8">

        <div className="flex gap-4 mb-8">
          <button
            className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 transition-colors font-bilo ${activeTab === "youtube" ? "border-primary text-gray-900 bg-gradient-to-r from-primary to-white" : "border-transparent text-gray-600 bg-transparent"}`}
            onClick={() => {
              setActiveTab("youtube")
              setCurrentPage(1)
            }}
          >
            YouTube Videos
          </button>
          {uploadedVideos.length > 0 && (
            <button
              className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 transition-colors font-bilo ${activeTab === "uploaded" ? "border-primary text-gray-900 bg-gradient-to-r from-primary to-white" : "border-transparent text-gray-600 bg-transparent"}`}
              onClick={() => {
                setActiveTab("uploaded")
                setCurrentPage(1)
              }}
            >
              Uploaded Videos
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {loading
            ? Array.from({ length: videosPerPage }).map((_, index) => <VideoSkeleton key={index} />)
            : getCurrentVideos().map((video) =>
                activeTab === "youtube" ? (
                  <a
                    key={video._id}
                    href={video.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group"
                  >
                    <VideoCard
                      title={video.title}
                      uploadTime={format(new Date(video.addedAt), "MMM d, yyyy")}
                      duration=""
                      thumbnailUrl={
                        video.videoType === "youtube" && video.youtubeUrl
                          ? `https://img.youtube.com/vi/${getYouTubeVideoId(video.youtubeUrl)}/hqdefault.jpg`
                          : getThumbnailUrl(video.imageUrl) || "/gallery/gallery2.png"
                      }
                    />
                  </a>
                ) : (
                  <Link key={video._id} href={`/videos/${video._id}`} className="relative group">
                    <VideoCard
                      title={video.title}
                      uploadTime={format(new Date(video.addedAt), "MMM d, yyyy")}
                      duration=""
                      thumbnailUrl={
                        video.videoType === "youtube" && video.youtubeUrl
                          ? `https://img.youtube.com/vi/${getYouTubeVideoId(video.youtubeUrl)}/hqdefault.jpg`
                          : getThumbnailUrl(video.imageUrl) || "/gallery/gallery2.png"
                      }
                    />
                  </Link>
                )
              )}
        </div>

        {!loading && totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage > 1) {
                        handlePageChange(currentPage - 1)
                      }
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            handlePageChange(page)
                          }}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )
                  }
                  return null
                })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage < totalPages) {
                        handlePageChange(currentPage + 1)
                      }
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}
