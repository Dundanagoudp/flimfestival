"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Youtube, Video, Calendar, ExternalLink, Share2, Download } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getVideoById, deleteVideoBlog } from "@/services/videosServices"
import type { VideoBlog } from "@/types/videosTypes"
import { useToast } from "@/components/ui/custom-toast"
import DynamicButton from "@/components/common/DynamicButton"
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog"
import { useAuth } from "@/context/auth-context"
import { getMediaUrl } from "@/utils/media"
import { sanitizeUrl } from "@/lib/sanitize"

export default function VideoDetailPage() {
  const params = useParams() as { id?: string }
  const id = params.id ?? ""
  const router = useRouter()
  const { showToast } = useToast()
  const [video, setVideo] = useState<VideoBlog | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    loading: boolean
  }>({
    open: false,
    loading: false
  })
  const { userRole } = useAuth()
  const canDelete = userRole === "admin"
  const getImageSrc = (url: string) => {
    return getMediaUrl(url)
  }

  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true)
      try {
        const result = await getVideoById(id)
        if (result.success && result.data) {
          console.log(result.data)
          setVideo(result.data)
        } else {
          showToast("Video not found", "error")
          router.replace("/admin/dashboard/videos")
        }
      } catch (error) {
        showToast("Failed to fetch video", "error")
        router.replace("/admin/dashboard/videos")
      } finally {
        setLoading(false)
      }
    }
    fetchVideo()
  }, [id])

  const handleDeleteClick = () => {
    if (!canDelete) {
      showToast("You don't have permission to delete videos", "error")
      return
    }
    setDeleteDialog({
      open: true,
      loading: false
    })
  }
  

  const handleDeleteConfirm = async () => {
    if (!video) return

    setDeleteDialog(prev => ({ ...prev, loading: true }))

    try {
      const response = await deleteVideoBlog(video._id)
      if (response.success) {
        showToast("Video deleted successfully", "success")
        router.push("/admin/dashboard/videos")
      } else {
        showToast(response.error || "Failed to delete video", "error")
        setDeleteDialog(prev => ({ ...prev, loading: false }))
      }
    } catch (error) {
      showToast("An unexpected error occurred", "error")
      setDeleteDialog(prev => ({ ...prev, loading: false }))
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, loading: false })
  }

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1` : null
  }

  const getYouTubeVideoId = (url: string) => {
    return url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1] || ""
  }

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    if (!video || !url) return

    const copyToClipboard = async (): Promise<boolean> => {
      if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) return false
      try {
        await navigator.clipboard.writeText(url)
        return true
      } catch {
        return false
      }
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: `Check out this video: ${video.title}`,
          url,
        })
        showToast("Shared successfully", "success")
      } catch (err) {
        const copied = await copyToClipboard()
        if (copied) showToast("Video link copied to clipboard", "success")
        else showToast(`Link: ${url}`, "info")
      }
    } else {
      const copied = await copyToClipboard()
      if (copied) showToast("Video link copied to clipboard", "success")
      else showToast(`Link: ${url}`, "info")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading video details...</p>
        </div>
      </div>
    )
  }

  if (!video) {
  return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Video className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-700">Video not found</h3>
          <p className="text-muted-foreground mb-6">
            The video you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/admin/dashboard/videos">Back to Videos</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 pt-6 bg-gradient-to-br from-gray-50/50 to-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <Button
          variant="outline"
          size="sm"
          asChild
          className="w-fit bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white"
        >
          <Link href="/admin/dashboard/videos">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Videos
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap mb-3">
            {video.videoType === "youtube" ? (
              <div className="bg-red-100 p-2 rounded-lg">
                <Youtube className="h-6 w-6 text-red-600" />
              </div>
            ) : (
              <div className="bg-blue-100 p-2 rounded-lg">
                <Video className="h-6 w-6 text-blue-600" />
              </div>
            )}
            <Badge
              variant={video.videoType === "youtube" ? "destructive" : "default"}
              className="text-sm px-3 py-1"
            >
              {video.videoType === "youtube" ? "YouTube Video" : "Uploaded Video"}
            </Badge>
            <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {video.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Added on{" "}
                {new Date(video.addedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleShare} className="bg:white/80 backdrop-blur-sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" asChild className="bg-white/80 backdrop-blur-sm">
            <Link href={`/admin/dashboard/videos/edit/${video._id}`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <DynamicButton 
            variant="destructive" 
            onClick={handleDeleteClick}
            icon={<Trash2 className="h-4 w-4 mr-2" />}
            disabled={!canDelete}
          >
            Delete
          </DynamicButton>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-3">
          <Card className="border-0 shadow-xl overflow-hidden bg-black">
            <CardContent className="p-0">
              {video.videoType === "youtube" && video.youtubeUrl && (
                <div className="flex flex-col items-center justify-center p-6 bg:white rounded-lg shadow mb-6">
                  <div className="aspect-video w-full max-w-2xl bg-gray-100 rounded-lg overflow-hidden mb-4">
                    <img
                      src={`https://img.youtube.com/vi/${getYouTubeVideoId(video.youtubeUrl)}/hqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <h2 className="text-xl font-semibold mb-2 text-center">{video.title}</h2>
                  <Button
                    asChild
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <a href={sanitizeUrl(video.youtubeUrl) || '#'} target="_blank" rel="noopener noreferrer">
                      <Youtube className="h-4 w-4 mr-2" />
                      Watch on YouTube
                    </a>
                  </Button>
                </div>
              )}

              {video.videoType === "video" && video.video_url && (
                <div className="aspect-video relative">
                  <video
                    src={getMediaUrl(video.video_url)}
                    poster={video.imageUrl}
                    controls
                    className="w-full h-full"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {video.videoType === "video" && !video.video_url && video.imageUrl && (
                <div className="aspect-video relative">
                  <Image
                    src={getImageSrc(video.imageUrl) || "/placeholder.svg"}
                    alt={video.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Video className="h-16 w-16 mx-auto mb-4 opacity-80" />
                      <p className="text-lg">Video preview only</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Video Information Sidebar */}
        <div className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="bg-blue-100 p-1.5 rounded-lg">
                  <Video className="h-4 w-4 text-blue-600" />
                </div>
                Video Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Type</span>
                  <Badge variant={video.videoType === "youtube" ? "destructive" : "default"}>
                    {video.videoType === "youtube" ? "YouTube" : "Upload"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Added</span>
                  <span className="text-sm text-gray-800">{new Date(video.addedAt).toLocaleDateString()}</span>
                </div>

                {video.videoType === "youtube" && video.youtubeUrl && (
                  <div className="p-3 bg-red-50 rounded-lg">
                    <h4 className="text-sm font-medium text-red-800 mb-2">YouTube Link</h4>
                    <Button variant="outline" size="sm" asChild className="w-full justify-start bg-white/80">
                      <a href={sanitizeUrl(video.youtubeUrl) || '#'} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open in YouTube
                      </a>
                    </Button>
                  </div>
                )}

                {video.videoType === "video" && video.video_url && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">Video File</h4>
                    <Button variant="outline" size="sm" asChild className="w-full justify-start bg-white/80">
                      <a href={sanitizeUrl(video.video_url) || '#'} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Download Original
                      </a>
                    </Button>
                  </div>
                )}

                {video.imageUrl && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="text-sm font-medium text-green-800 mb-3">Thumbnail</h4>
                    <div className="space-y-3">
                      <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100 border">
                        <Image
                          src={getImageSrc(video.imageUrl) || "/placeholder.svg"}
                          alt={`${video.title} thumbnail`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 64px, 96px"
                        />
                      </div>
                      <Button variant="outline" size="sm" asChild className="w-full justify-start bg-white/80">
                        <a href={sanitizeUrl(video.imageUrl) || '#'} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Full Size
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="bg-purple-100 p-1.5 rounded-lg">
                  <Edit className="h-4 w-4 text-purple-600" />
                </div>
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" asChild className="w-full justify-start bg-white/80 hover:bg-blue-50">
                <Link href={`/admin/dashboard/videos/edit/${video._id}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Video Details
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={handleShare}
                className="w-full justify-start bg-white/80 hover:bg-green-50"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Video
              </Button>
              <DynamicButton
                variant="outline"
                onClick={handleDeleteClick}
                className="w-full justify-start text-red-600 hover:text-red-700 bg-white/80 hover:bg-red-50 border-red-200"
                icon={<Trash2 className="h-4 w-4 mr-2" />}
                disabled={!canDelete}
              >
                Delete Video
              </DynamicButton>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialog.open}
        onOpenChange={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Video"
        description="Are you sure you want to delete this video? This action cannot be undone."
        itemName={video?.title}
        loading={deleteDialog.loading}
        variant="destructive"
      />
    </div>
  )
}
