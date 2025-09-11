import apiClient from "@/apiClient"
import {
  AboutBanner,
  AboutIntroduction,
  AboutStatistics,
  CreateBannerPayload,
  CreateIntroductionPayload,
  CreateStatisticsPayload,
  DeleteResponse,
  UpdateBannerPayload,
  UpdateIntroductionPayload,
  UpdateStatisticsPayload,
} from "@/types/aboutTypes"

const BASE = "/aboutus"

// Banner
export async function createAboutBanner(payload: CreateBannerPayload) {
  const formData = new FormData()
  formData.append("title", payload.title)
  formData.append("backgroundImage", payload.backgroundImage)
  const { data } = await apiClient.post<{ success: boolean; message: string; data: AboutBanner }>(`${BASE}/banner`, formData)
  return data.data
}

export async function getAboutBanner() {
  const { data } = await apiClient.get<{ success: boolean; message: string; data: AboutBanner }>(`${BASE}/banner`)
  return data.data
}

export async function updateAboutBanner(id: string, payload: UpdateBannerPayload) {
  const formData = new FormData()
  if (payload.title !== undefined) formData.append("title", payload.title)
  if (payload.backgroundImage) formData.append("backgroundImage", payload.backgroundImage)
  const { data } = await apiClient.put<{ success: boolean; message: string; data: AboutBanner }>(`${BASE}/banner/${id}`, formData)
  return data.data
}

export async function deleteAboutBanner(id: string) {
  const { data } = await apiClient.delete<{ success: boolean; message: string; data: DeleteResponse }>(`${BASE}/banner/${id}`)
  return data.data
}

// Statistics
export async function createAboutStatistics(payload: CreateStatisticsPayload) {
  const formData = new FormData()
  formData.append("years", String(payload.years))
  formData.append("films", String(payload.films))
  formData.append("countries", String(payload.countries))
  formData.append("image", payload.image)
  const { data } = await apiClient.post<{ success: boolean; message: string; data: AboutStatistics }>(`${BASE}/statistics`, formData)
  return data.data
}

export async function getAboutStatistics() {
  const { data } = await apiClient.get<{ success: boolean; message: string; data: AboutStatistics }>(`${BASE}/statistics`)
  return data.data
}

export async function updateAboutStatistics(id: string, payload: UpdateStatisticsPayload) {
  const formData = new FormData()
  if (payload.years !== undefined) formData.append("years", String(payload.years))
  if (payload.films !== undefined) formData.append("films", String(payload.films))
  if (payload.countries !== undefined) formData.append("countries", String(payload.countries))
  if (payload.image) formData.append("image", payload.image)
  const { data } = await apiClient.put<{ success: boolean; message: string; data: AboutStatistics }>(`${BASE}/statistics/${id}`, formData)
  return data.data
}

export async function deleteAboutStatistics(id: string) {
  const { data } = await apiClient.delete<{ success: boolean; message: string; data: DeleteResponse }>(`${BASE}/statistics/${id}`)
  return data.data
}

// Introduction
export async function createAboutIntroduction(payload: CreateIntroductionPayload) {
  const formData = new FormData()
  formData.append("title", payload.title)
  formData.append("description", payload.description)
  if (payload.image) formData.append("image", payload.image)
  const { data } = await apiClient.post<{ success: boolean; message: string; data: AboutIntroduction }>(`${BASE}/introduction`, formData)
  return data.data
}

export async function getAboutIntroduction() {
  const { data } = await apiClient.get<{ success: boolean; message: string; data: AboutIntroduction }>(`${BASE}/introduction`)
  return data.data
}

export async function updateAboutIntroduction(id: string, payload: UpdateIntroductionPayload) {
  const formData = new FormData()
  if (payload.title !== undefined) formData.append("title", payload.title)
  if (payload.description !== undefined) formData.append("description", payload.description)
  if (payload.image) formData.append("image", payload.image)
  const { data } = await apiClient.put<{ success: boolean; message: string; data: AboutIntroduction }>(`${BASE}/introduction/${id}`, formData)
  return data.data
}

export async function deleteAboutIntroduction(id: string) {
  const { data } = await apiClient.delete<{ success: boolean; message: string; data: DeleteResponse }>(`${BASE}/introduction/${id}`)
  return data.data
}
export async function getStats() {
  try {
    const response = await apiClient.get<{
      success: boolean, message: string, data: {
        years: number,
        films: number,
        countries: number,
        image: string
      }[]
    }>("/aboutus/statistics")
    return response.data.data
  } catch (error) {
    console.log(error)
    throw error

  }


}


export async function getIntroduction() {
  try {
    const { data } = await apiClient.get<{ success: boolean; message: string; data: AboutIntroduction }>(`${BASE}/introduction`)
    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}
