

const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_MEDIA_BASE_URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export function getMediaUrl(relativePath: string | null | undefined): string {
    // Handle null, undefined, or empty strings
    if (!relativePath || relativePath.trim() === "") {
      return "/placeholder.svg"
    }

    // If it's already a full URL (like YouTube thumbnails), validate and return as is
    if (relativePath.startsWith("http://") || relativePath.startsWith("https://")) {
      try {
        // Validate URL
        new URL(relativePath)
        return relativePath
      } catch {
        // Invalid URL, return placeholder
        return "/placeholder.svg"
      }
    }

    // Determine base URL: prefer MEDIA_BASE_URL, fallback to API_BASE_URL
    let baseUrl = MEDIA_BASE_URL
    if (!baseUrl || baseUrl.trim() === "") {
      baseUrl = API_BASE_URL || ""
    }

    // If no base URL is available, return placeholder
    if (!baseUrl || baseUrl.trim() === "") {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[getMediaUrl] Neither NEXT_PUBLIC_MEDIA_BASE_URL nor NEXT_PUBLIC_API_BASE_URL is defined')
        console.warn('[getMediaUrl] Image path:', relativePath)
      }
      return "/placeholder.svg"
    }

    // Images are served through the API, so keep the full API_BASE_URL (including /api/v1)
    // Remove trailing slash from base URL and ensure relative path starts with /
    const cleanBaseUrl = baseUrl.replace(/\/$/, '')
    const cleanRelativePath = relativePath.startsWith("/") ? relativePath : `/${relativePath}`
    const fullUrl = `${cleanBaseUrl}${cleanRelativePath}`
    
    // Validate the constructed URL
    try {
      new URL(fullUrl)
      if (process.env.NODE_ENV === 'development') {
        console.log('Media URL:', { relativePath, baseUrl: cleanBaseUrl, fullUrl })
      }
      return fullUrl
    } catch {
      // Invalid URL, return placeholder
      if (process.env.NODE_ENV === 'development') {
        console.warn('[getMediaUrl] Invalid URL constructed:', fullUrl)
      }
      return "/placeholder.svg"
    }
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