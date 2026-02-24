"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getVideoById } from "@/services/videosServices"
import type { VideoBlog } from "@/types/videosTypes"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { getVideoUrl, getThumbnailUrl } from "@/utils/media"
import { useToast } from "@/components/ui/custom-toast"

export default function PublicVideoDetail() {
  const params = useParams()
  const router = useRouter()
  const videoId = params?.id as string
  const [video, setVideo] = useState<VideoBlog | null>(null)
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    async function fetchVideo() {
      setLoading(true)
      const res = await getVideoById(videoId)
      if (res.success && res.data) setVideo(res.data)
      setLoading(false)
    }
    if (videoId) fetchVideo()
  }, [videoId])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffaee] flex items-center justify-center">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-[#fffaee] flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-700 text-xl mb-4">Video not found</div>
          <Button
            onClick={() => router.back()}
            className="bg-gray-800 hover:bg-gray-700 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fffaee] px-2 sm:px-4 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto mb-4 sm:mb-6">
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-100 text-sm sm:text-base font-bilo"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden transform transition-all duration-500 hover:scale-[1.02] animate-in slide-in-from-bottom-4">
          <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-xl sm:rounded-t-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 to-purple-50/20 animate-pulse" />
            {video.videoType === "youtube" && video.youtubeUrl ? (
              <iframe
                width="100%"
                height="100%"
                src={video.youtubeUrl.replace("watch?v=", "embed/")}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full relative z-10 transition-opacity duration-300 hover:opacity-95"
              />
            ) : video.videoType === "video" && video.video_url ? (
              <video
                controls
                className="w-full h-full object-cover relative z-10 transition-transform duration-300 hover:scale-[1.01]"
                src={getVideoUrl(video.video_url)}
                poster={getThumbnailUrl(video.imageUrl)}
                preload="metadata"
                crossOrigin="anonymous"
                onError={() => {
                  showToast(
                    "There was an issue playing this video. Please try refreshing the page.",
                    "error"
                  )
                }}
              >
                <source src={getVideoUrl(video.video_url)} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 relative z-10">
                <div className="text-center text-gray-500 animate-bounce">
                  <p className="text-base sm:text-lg">No video available</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-white to-gray-50/50">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight transform transition-all duration-300 hover:text-gray-700 animate-in slide-in-from-left-2 font-dm-serif">
                {video.title}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                <p className="text-sm sm:text-base text-gray-600 transform transition-colors duration-300 hover:text-gray-800 animate-in slide-in-from-left-4 font-bilo">
                  {format(new Date(video.addedAt), "MMMM d, yyyy")}
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs sm:text-sm text-gray-500 font-bilo">
                    Available Now
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center space-x-2 opacity-30">
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  )
}
