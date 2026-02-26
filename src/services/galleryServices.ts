import apiClient from "@/apiClient"
import {
  AddImagesResponse,
  BulkDeleteImagesRequest,
  CreateDayPayload,
  CreateYearPayload,
  DaysResponse,
  DayCreateResponse,
  DayUpdateResponse,
  GetAllGalleryByDayResponse,
  GetAllGalleryByYearResponse,
  SimpleMessageResponse,
  UpdateDayPayload,
  UpdateYearPayload,
  YearCreateResponse,
  YearwiseResponse,
  YearsResponse,
} from "@/types/galleryTypes"
import { GetAllMediaResponse } from "@/types/HomeTypes"

const BASE = "/gallery"

// Years
export async function createYear(payload: CreateYearPayload) {
  try {
    const { data } = await apiClient.post<YearCreateResponse>(`${BASE}/gallerycreateYear`, payload)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to create year")
  }
}

export async function updateYear(id: string, payload: UpdateYearPayload) {
  try {
    const { data } = await apiClient.put<SimpleMessageResponse & { item?: any }>(`${BASE}/updateyear/${id}`, payload)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to update year")
  }
}

export async function getAllYears() {
  try {
    const { data } = await apiClient.get<YearsResponse>(`${BASE}/getallyear`)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to get years")
  }
}

export async function deleteYear(id: string) {
  try {
    const { data } = await apiClient.delete<SimpleMessageResponse>(`${BASE}/deleteyear/${id}`)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to delete year")
  }
}

// Days
export async function getDaysByYear(yearId: string) {
  try {
    const { data } = await apiClient.get<DaysResponse>(`${BASE}/getdaysbyyear`, { params: { yearId } })
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to get days")
  }
}

export async function createDay(payload: CreateDayPayload) {
  try {
    const { data } = await apiClient.post<DayCreateResponse>(`${BASE}/gallerycreateDay`, payload)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to create day")
  }
}

export async function updateDay(id: string, payload: UpdateDayPayload) {
  try {
    const { data } = await apiClient.put<DayUpdateResponse>(`${BASE}/updateday/${id}`, payload)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to update day")
  }
}

export async function deleteDay(id: string) {
  try {
    const { data } = await apiClient.delete<SimpleMessageResponse>(`${BASE}/deleteday/${id}`)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to delete day")
  }
}

// Images
export async function addImages(yearId: string, dayId: string, files: File[], caption?: string) {
  try {
    const fd = new FormData()
    fd.append("year", yearId)
    fd.append("day", dayId)
    if (caption != null && caption.trim() !== "") fd.append("caption", caption.trim())
    for (const f of files) {
      fd.append("photo", f)
    }
    const { data } = await apiClient.post<AddImagesResponse>(`${BASE}/addimages`, fd)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to add images")
  }
}

export async function getAllGalleryByYear(yearId: string, dayId?: string) {
  try {
    const url = `${BASE}/getallgallery`
    const params = dayId ? { yearId, dayId } : { yearId }
    const { data } = await apiClient.get<GetAllGalleryByYearResponse | GetAllGalleryByDayResponse>(url, {
      params,
    })
    // When no dayId: normalize new shape (days + imagesWithoutDay) to include .images for backward compatibility
    if (!dayId && data && "days" in data && Array.isArray((data as GetAllGalleryByYearResponse).days)) {
      const byYear = data as GetAllGalleryByYearResponse
      const images = byYear.days.flatMap((d) => d.images).concat(byYear.imagesWithoutDay ?? [])
      return { ...byYear, images }
    }
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to get gallery by year")
  }
}

export async function deleteImage(imageId: string) {
  try {
    const { data } = await apiClient.delete<SimpleMessageResponse>(`${BASE}/deletegallery/${imageId}`)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to delete image")
  }
}

export async function bulkDeleteImages(imageIds: string[]) {
  try {
    const body: BulkDeleteImagesRequest = { imageIds }
    const { data } = await apiClient.delete<SimpleMessageResponse>(`${BASE}/bulkdeleteimages`, { data: body })
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to bulk delete images")
  }
}

// Year-wise
export async function getGalleryYearwise() {
  try {
    const { data } = await apiClient.get<YearwiseResponse>(`${BASE}/gallery-yearwise`)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to get gallery yearwise")
  }
}

export async function getVideoHome(): Promise<GetAllMediaResponse> {
  try {
    const response = await apiClient.get<GetAllMediaResponse>("/Homepage");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to get video home"
    );
  }
}