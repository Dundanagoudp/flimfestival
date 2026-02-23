import apiClient from "@/apiClient"
import type { HeroBanner, HeroBannerCreatePayload, HeroBannerUpdatePayload } from "@/types/heroBannerTypes"

const BASE = "/hero-banner"

interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

function getErrorMessage(err: unknown): string {
  const anyErr = err as { response?: { data?: { error?: string; message?: string } }; message?: string }
  return anyErr?.response?.data?.error ?? anyErr?.response?.data?.message ?? anyErr?.message ?? "Request failed"
}

export async function getHeroBanner(): Promise<HeroBanner | null> {
  try {
    const { data } = await apiClient.get<ApiResponse<HeroBanner>>(BASE)
    if (data.success && data.data) return data.data
    return null
  } catch (err: unknown) {
    const anyErr = err as { response?: { status?: number } }
    if (anyErr?.response?.status === 404) return null
    throw new Error(getErrorMessage(err))
  }
}

export async function createHeroBanner(payload: HeroBannerCreatePayload): Promise<HeroBanner> {
  const formData = new FormData()
  formData.append("title", payload.title)
  formData.append("subtitle", payload.subtitle)
  if (payload.video) formData.append("video", payload.video)
  const { data } = await apiClient.post<ApiResponse<HeroBanner>>(BASE, formData)
  if (!data.success || !data.data) throw new Error(data.error ?? data.message ?? "Create failed")
  return data.data
}

export async function updateHeroBanner(payload: HeroBannerUpdatePayload & { _id: string }): Promise<HeroBanner> {
  const formData = new FormData()
  if (payload.title !== undefined) formData.append("title", payload.title)
  if (payload.subtitle !== undefined) formData.append("subtitle", payload.subtitle)
  if (payload.video) formData.append("video", payload.video)
  const { data } = await apiClient.put<ApiResponse<HeroBanner>>(BASE, formData)
  if (!data.success || !data.data) throw new Error(data.error ?? data.message ?? "Update failed")
  return data.data
}

export async function deleteHeroBanner(): Promise<{ deleted: boolean }> {
  const { data } = await apiClient.delete<ApiResponse<{ deleted: boolean }>>(BASE)
  if (!data.success || !data.data) throw new Error(data.error ?? data.message ?? "Delete failed")
  return data.data
}
