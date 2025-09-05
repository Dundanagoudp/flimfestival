// Video Types
export type VideoType = "youtube" | "video"

export interface VideoBlog {
  _id: string
  title: string
  videoType: VideoType
  // For uploaded video entries
  imageUrl?: string
  video_url?: string
  // For YouTube entries
  youtubeUrl?: string
  addedAt: string
  __v: number
}

export interface CreateYouTubeVideoPayload {
  title: string
  videoType: "youtube"
  youtubeUrl: string
  addedAt: string
  thumbnail?: File
}

export interface CreateUploadedVideoPayload {
  title: string
  videoType: "video"
  video: File
  thumbnail: File
  addedAt: string
}

export interface UpdateVideoPayload {
  title?: string
  videoType?: VideoType
  youtubeUrl?: string
  addedAt?: string
  video?: File
  thumbnail?: File
}

export interface SimpleMessageResponse {
  message: string
}

export type GetAllVideosResponse = Array<VideoBlog>
export type GetYouTubeVideosResponse = Array<VideoBlog>
export type GetUploadedVideosResponse = Array<VideoBlog>


