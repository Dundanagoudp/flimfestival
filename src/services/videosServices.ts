import apiClient from "@/apiClient"
import {
  CreateUploadedVideoPayload,
  CreateYouTubeVideoPayload,
  GetAllVideosResponse,
  GetUploadedVideosResponse,
  GetYouTubeVideosResponse,
  SimpleMessageResponse,
  UpdateVideoPayload,
  VideoBlog,
} from "@/types/videosTypes"

const BASE = "/videos"

export async function addYouTubeVideo(payload: CreateYouTubeVideoPayload) {
  try {
    const formData = new FormData()
    formData.append("title", payload.title)
    formData.append("videoType", payload.videoType)
    formData.append("youtubeUrl", payload.youtubeUrl)
    formData.append("addedAt", payload.addedAt)
    if (payload.thumbnail) formData.append("thumbnail", payload.thumbnail)

    const { data } = await apiClient.post<VideoBlog>(`${BASE}/addVideoBlog`, formData)
    return data
  } catch (error: any) {
    console.error("Error adding YouTube video:", error)
    throw new Error(error?.response?.data?.message || error?.message || "Failed to add YouTube video")
  }
}

export async function addUploadedVideo(payload: CreateUploadedVideoPayload) {
  try {
    const formData = new FormData()
    formData.append("title", payload.title)
    formData.append("videoType", payload.videoType)
    formData.append("video", payload.video)
    formData.append("thumbnail", payload.thumbnail)
    formData.append("addedAt", payload.addedAt)

    const { data } = await apiClient.post<VideoBlog>(`${BASE}/addVideoBlog`, formData)
    return data
  } catch (error: any) {
    console.error("Error adding uploaded video:", error)
    throw new Error(error?.response?.data?.message || error?.message || "Failed to add uploaded video")
  }
}

export async function updateVideo(id: string, payload: UpdateVideoPayload) {
  try {
    const formData = new FormData()
    if (payload.title !== undefined) formData.append("title", payload.title)
    if (payload.videoType !== undefined) formData.append("videoType", payload.videoType)
    if (payload.youtubeUrl !== undefined) formData.append("youtubeUrl", payload.youtubeUrl)
    if (payload.addedAt !== undefined) formData.append("addedAt", payload.addedAt)
    if (payload.video) formData.append("video", payload.video)
    if (payload.thumbnail) formData.append("thumbnail", payload.thumbnail)

    const { data } = await apiClient.put<{ message: string; videoBlog: VideoBlog }>(`${BASE}/updateVideo/${id}`, formData)
    return data
  } catch (error: any) {
    console.error("Error updating video:", error)
    throw new Error(error?.response?.data?.message || error?.message || "Failed to update video")
  }
}

export async function getAllVideos() {
  try {
    const { data } = await apiClient.get<GetAllVideosResponse>(`${BASE}/getVideoBlog`)
    return data
  } catch (error: any) {
    console.error("Error fetching all videos:", error)
    throw new Error(error?.response?.data?.message || error?.message || "Failed to fetch videos")
  }
}

export async function getYouTubeVideos() {
  try {
    const { data } = await apiClient.get<GetYouTubeVideosResponse>(`${BASE}/getYoutubeVideo`)
    return data
  } catch (error: any) {
    console.error("Error fetching YouTube videos:", error)
    throw new Error(error?.response?.data?.message || error?.message || "Failed to fetch YouTube videos")
  }
}

export async function getUploadedVideos() {
  try {
    const { data } = await apiClient.get<GetUploadedVideosResponse>(`${BASE}/getuploadedVideo`)
    return data
  } catch (error: any) {
    console.error("Error fetching uploaded videos:", error)
    throw new Error(error?.response?.data?.message || error?.message || "Failed to fetch uploaded videos")
  }
}

export async function getVideoById(id: string) {
  try {
    const { data } = await apiClient.get<VideoBlog>(`${BASE}/getVideoById/${id}`)
    return data
  } catch (error: any) {
    console.error("Error fetching video by id:", error)
    throw new Error(error?.response?.data?.message || error?.message || "Failed to fetch video by id")
  }
}

export async function deleteVideo(id: string) {
  try {
    const { data } = await apiClient.delete<SimpleMessageResponse>(`${BASE}/deleteVideo/${id}`)
    return data
  } catch (error: any) {
    console.error("Error deleting video:", error)
    throw new Error(error?.response?.data?.message || error?.message || "Failed to delete video")
  }
}


