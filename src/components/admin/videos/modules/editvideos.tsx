"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Upload, Youtube, Loader2, Video } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getVideoById, updateVideoBlog } from "@/services/videosServices"
import type { VideoBlog } from "@/types/videosTypes"
import { useToast } from "@/components/ui/custom-toast"
import DynamicButton from "@/components/common/DynamicButton"

export default function EditVideoPage() {
  const params = useParams() as { id?: string };
  const id = params.id ?? "";
  const router = useRouter();
  const { showToast } = useToast();
  const [video, setVideo] = useState<VideoBlog | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [videoType, setVideoType] = useState<"youtube" | "video">("youtube")
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [youtubeData, setYoutubeData] = useState<any>(null)
  const [fetchingYoutube, setFetchingYoutube] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
  });

  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true);
      try {
        const result = await getVideoById(id);
        if (result.success && result.data) {
          setVideo(result.data);
          setFormData({
            title: result.data.title,
          });
          setVideoType(result.data.videoType)
        
        // Initialize YouTube URL if it exists
          if (result.data.youtubeUrl) {
            setYoutubeUrl(result.data.youtubeUrl)
            fetchYouTubeData(result.data.youtubeUrl)
        }
      } else {
          showToast("Video not found", "error");
          router.replace("/admin/dashboard/videos");
        }
      } catch (error) {
        showToast("Failed to fetch video", "error");
        router.replace("/admin/dashboard/videos");
      } finally {
        setLoading(false);
        setFetchLoading(false);
    }
    };
    fetchVideo();
  }, [id]);

  // Function to extract YouTube video ID
  const getYouTubeVideoId = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
    return videoId
  }

  // Function to fetch YouTube video data
  const fetchYouTubeData = async (url: string) => {
    const videoId = getYouTubeVideoId(url)
    if (!videoId) {
      setYoutubeData(null)
      return
    }

    setFetchingYoutube(true)
    try {
      // You can use YouTube Data API here, but for now we'll create a basic structure
      const videoData = {
        id: videoId,
        title: `YouTube Video (${videoId})`,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        watchUrl: url
      }
      setYoutubeData(videoData)
    } catch (error) {
      // Error fetching YouTube data
      setYoutubeData(null)
    } finally {
      setFetchingYoutube(false)
    }
  }

  // Handle YouTube URL change
  const handleYoutubeUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setYoutubeUrl(url)
    
    // Fetch YouTube data when URL is valid
    if (url.trim() && getYouTubeVideoId(url)) {
      fetchYouTubeData(url)
    } else {
      setYoutubeData(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!video) return

    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const title = formData.get("title") as string

    if (!title.trim()) {
      showToast("Please enter a title", "error")
      setLoading(false)
      return
    }

    try {
      const data: any = {
        title,
        videoType,
      }
      
      const addedAt = formData.get("addedAt") as string
      if (addedAt) {
        data.addedAt = addedAt
      }

      if (videoType === "youtube") {
        const youtubeUrl = formData.get("youtubeUrl") as string
        if (!youtubeUrl.trim()) {
          showToast("Please enter a YouTube URL", "error")
          setLoading(false)
          return
        }
        data.youtubeUrl = youtubeUrl
      } else {
        const videoFile = formData.get("video") as File
        const thumbnail = formData.get("thumbnail") as File

        // Only add files if they are actually selected (not empty)
        if (videoFile && videoFile.size > 0) {
          data.video = videoFile
        }
        if (thumbnail && thumbnail.size > 0) {
          data.thumbnail = thumbnail
        }
      }

      const response = await updateVideoBlog(video._id, data)

      if (response.success) {
        showToast("Video updated successfully", "success")
        router.push("/admin/dashboard/videos")
      } else {
        showToast(response.error || "Failed to update video", "error")
      }
    } catch (error) {
      showToast("An unexpected error occurred", "error")
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading video details...</p>
        </div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Video not found</p>
          <Button asChild>
            <Link href="/admin/dashboard/videos">Back to Videos</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/dashboard/videos">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
    <div>
          <h1 className="text-3xl font-bold">Edit Video</h1>
          <p className="text-gray-600 mt-1">Update video details</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Video Details</CardTitle>
          <CardDescription>Update the video information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" defaultValue={video.title} placeholder="Enter video title" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="addedAt">Added Date</Label>
              <Input
                id="addedAt"
                name="addedAt"
                type="datetime-local"
                defaultValue={new Date(video.addedAt).toISOString().slice(0, 16)}
              />
            </div>

            <Tabs value={videoType} onValueChange={(value: string) => setVideoType(value as "youtube" | "video")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="youtube" className="flex items-center gap-2">
                  <Youtube className="h-4 w-4" />
                  YouTube
                </TabsTrigger>
                <TabsTrigger value="video" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload File
                </TabsTrigger>
              </TabsList>

              <TabsContent value="youtube" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="youtubeUrl">YouTube URL *</Label>
                  <Input
                    id="youtubeUrl"
                    name="youtubeUrl"
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    required={videoType === "youtube"}
                    value={youtubeUrl}
                    onChange={handleYoutubeUrlChange}
                  />
                  <p className="text-sm text-gray-600">Enter the full YouTube URL including https://</p>
                  
                  {/* YouTube Video Preview */}
                  {fetchingYoutube && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <p className="text-sm text-blue-700">Fetching video details...</p>
                      </div>
                    </div>
                  )}
                  
                  {youtubeData && !fetchingYoutube && (
                    <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-3">Video Preview:</p>
                      <div className="space-y-3">
                        {/* Thumbnail */}
                        <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                          <img 
                            src={youtubeData.thumbnail} 
                            alt="YouTube thumbnail"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = `https://img.youtube.com/vi/${youtubeData.id}/hqdefault.jpg`
                            }}
                          />
                        </div>
                        
                        {/* Video Info */}
                        <div className="space-y-2">
                          <p className="text-sm font-medium">{youtubeData.title}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span>Video ID: {youtubeData.id}</span>
                            <span>•</span>
                            <a 
                              href={youtubeData.watchUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Open in YouTube
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="video" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="video">Video File</Label>
                  <Input id="video" name="video" type="file" accept="video/*" />
                  <p className="text-sm text-gray-600">Leave empty to keep current video file</p>
                  
                  {/* Show current video if exists */}
                  {video.video_url && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-2">Current Video:</p>
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-blue-500" />
                        <a 
                          href={video.video_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          View Current Video
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail</Label>
                  <Input id="thumbnail" name="thumbnail" type="file" accept="image/*" />
                  <p className="text-sm text-gray-600">Leave empty to keep current thumbnail</p>
                  
                  {/* Show current thumbnail if exists */}
                  {video.imageUrl && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-2">Current Thumbnail:</p>
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-12 relative rounded overflow-hidden">
                          <Image 
                            src={video.imageUrl} 
                            alt="Current thumbnail" 
                            fill 
                            className="object-cover"
                            sizes="(max-width: 768px) 64px, 96px"
                          />
                        </div>
                        <a 
                          href={video.imageUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          View Full Size
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-4 pt-4">
              <DynamicButton 
                type="submit" 
                loading={loading}
                loadingText="Updating Video..."
                className="flex-1"
                variant="default"
              >
                Update Video
              </DynamicButton>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/dashboard/videos">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
