import apiClient from "@/apiClient"
import {  
 AddImagesResponse,
  BulkDeleteImagesRequest,
  CreateYearPayload,
  GetAllGalleryResponse,
  SimpleMessageResponse,
  UpdateYearPayload,
  YearCreateResponse,
  YearwiseResponse,
  YearsResponse, 
} from "@/types/galleryTypes"

const BASE = "/gallery"

// Years
export async function createYear(payload: CreateYearPayload) {
  try {
    const { data } = await apiClient.post<YearCreateResponse>(`${BASE}/gallerycreateYear`, payload)
    return data
  } catch (error: any) {
    console.error("Error creating year:", error)
    throw new Error(error?.response?.data?.message || error?.message || "Failed to create year")
  }
}

export async function updateYear(id: string, payload: UpdateYearPayload) {
  try {
    const { data } = await apiClient.put<SimpleMessageResponse & { item?: any }>(`${BASE}/updateyear/${id}`, payload)
    return data
  } catch (error: any) {
    console.error("Error updating year:", error)
    throw new Error(error?.response?.data?.message || error?.message || "Failed to update year")
  }
}

export async function getAllYears() {
  try {
    const { data } = await apiClient.get<YearsResponse>(`${BASE}/getallyear`)
    return data
  } catch (error: any) {
    console.error("Error getting years:", error)
    throw new Error(error?.response?.data?.message || error?.message || "Failed to get years")
  }
}

export async function deleteYear(id: string) {
  try {
    const { data } = await apiClient.delete<SimpleMessageResponse>(`${BASE}/deleteyear/${id}`)
    return data
  } catch (error: any) {
    console.error("Error deleting year:", error)
    throw new Error(error?.response?.data?.message || error?.message || "Failed to delete year")
  }
}

// Images
export async function addImages(yearId: string, files: File[]) {
  try {
    const fd = new FormData()
    fd.append("year", yearId)
    for (const f of files) {
      fd.append("photo", f)
    }
    const { data } = await apiClient.post<AddImagesResponse>(`${BASE}/addimages`, fd)
    return data
  } catch (error: any) {
    console.error("Error adding images:", error)
    throw new Error(error?.response?.data?.message || error?.message || "Failed to add images")
  }
}

export async function getAllGalleryByYear(yearId: string) {
  try {
    const url = `${BASE}/getallgallery`
    const params = { yearId }
    // Fixed: Use the correct endpoint with query parameter as your backend expects
    const { data } = await apiClient.get<GetAllGalleryResponse>(url, {
      params: params
    })
    return data
  } catch (error: any) {
    console.error("Error getting gallery by year:", error)
    throw new Error(error?.response?.data?.message || error?.message || "Failed to get gallery by year")
  }
}

export async function deleteImage(imageId: string) {
  try {
    const { data } = await apiClient.delete<SimpleMessageResponse>(`${BASE}/deletegallery/${imageId}`)
    return data
  } catch (error: any) {
    console.error("Error deleting image:", error)
    throw new Error(error?.response?.data?.message || error?.message || "Failed to delete image")
  }
}

export async function bulkDeleteImages(imageIds: string[]) {
  try {
    const body: BulkDeleteImagesRequest = { imageIds }
    const { data } = await apiClient.delete<SimpleMessageResponse>(`${BASE}/bulkdeleteimages`, { data: body })
    return data
  } catch (error: any) {
    console.error("Error bulk deleting images:", error)
    throw new Error(error?.response?.data?.message || error?.message || "Failed to bulk delete images")
  }
}

// Year-wise
export async function getGalleryYearwise() {
  try {
    const { data } = await apiClient.get<YearwiseResponse>(`${BASE}/gallery-yearwise`)
    return data
  } catch (error: any) {
    console.error("Error getting gallery yearwise:", error)
    throw new Error(error?.response?.data?.message || error?.message || "Failed to get gallery yearwise")
  }
}
