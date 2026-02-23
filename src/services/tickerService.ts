import apiClient from "@/apiClient"
import type {
  TickerAnnouncement,
  TickerAnnouncementCreatePayload,
  TickerAnnouncementUpdatePayload,
} from "@/types/tickerTypes"

const BASE = "/ticker-announcements"

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

export async function getTickerAnnouncements(): Promise<TickerAnnouncement[]> {
  const { data } = await apiClient.get<ApiResponse<TickerAnnouncement[]>>(BASE)
  if (!data.success || !data.data) return []
  return Array.isArray(data.data) ? data.data : []
}

export async function getTickerAnnouncement(id: string): Promise<TickerAnnouncement> {
  const { data } = await apiClient.get<ApiResponse<TickerAnnouncement>>(`${BASE}/${id}`)
  if (!data.success || !data.data) throw new Error(data.error ?? data.message ?? "Ticker announcement not found")
  return data.data
}

export async function createTickerAnnouncement(payload: TickerAnnouncementCreatePayload): Promise<TickerAnnouncement> {
  const { data } = await apiClient.post<ApiResponse<TickerAnnouncement>>(BASE, payload)
  if (!data.success || !data.data) throw new Error(data.error ?? data.message ?? "Create failed")
  return data.data
}

export async function updateTickerAnnouncement(
  id: string,
  payload: TickerAnnouncementUpdatePayload
): Promise<TickerAnnouncement> {
  const { data } = await apiClient.put<ApiResponse<TickerAnnouncement>>(`${BASE}/${id}`, payload)
  if (!data.success || !data.data) throw new Error(data.error ?? data.message ?? "Update failed")
  return data.data
}

export async function deleteTickerAnnouncement(id: string): Promise<{ deleted: boolean }> {
  const { data } = await apiClient.delete<ApiResponse<{ deleted: boolean }>>(`${BASE}/${id}`)
  if (!data.success || !data.data) throw new Error(data.error ?? data.message ?? "Delete failed")
  return data.data
}
