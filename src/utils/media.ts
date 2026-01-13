

const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_MEDIA_BASE_URL

export function getMediaUrl(relativePath: string | null | undefined): string {
    if (!relativePath) {
      return "/placeholder.svg"
    }
      // If it's already a full URL (like YouTube thumbnails), return as is
  if (relativePath.startsWith("http://") || relativePath.startsWith("https://")) {
    return relativePath
  }
  const fullUrl = relativePath.startsWith("/") 
  ? `${MEDIA_BASE_URL}${relativePath}`
  : `${MEDIA_BASE_URL}/${relativePath}`
  if (process.env.NODE_ENV === 'development') {
    console.log('Media URL:', { relativePath, MEDIA_BASE_URL, fullUrl })
  }
  
  return fullUrl
}
export function getVideoUrl(videoUrl: string | null | undefined): string {
    return getMediaUrl(videoUrl)
  }

  export function getThumbnailUrl(thumbnailUrl: string | null | undefined): string {
    return getMediaUrl(thumbnailUrl)
  }

  export function isYouTubeUrl(url: string): boolean {
    return url.includes("youtube.com") || url.includes("youtu.be")
  }