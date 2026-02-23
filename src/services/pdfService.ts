import apiClient from "@/apiClient"
import type { PdfItem } from "@/types/pdfTypes"

const BASE = "/pdfs"

interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

function getErrorMessage(err: any): string {
  const msg = err?.response?.data?.error ?? err?.message
  if (msg) return msg
  const status = err?.response?.status
  if (status === 400) return "Invalid file or name"
  if (status === 404) return "PDF not found"
  if (status === 500) return "Server error"
  return "PDF request failed"
}

async function request<T>(
  method: "get" | "post" | "put" | "delete",
  path: string,
  body?: object | FormData
): Promise<T> {
  try {
    const response = await apiClient.request<ApiResponse<T>>({
      method,
      url: path,
      data: body,
    })
    const res = response.data
    if (!res.success || res.error) {
      throw new Error(res.error || "Request failed")
    }
    return res.data as T
  } catch (err: any) {
    throw new Error(getErrorMessage(err))
  }
}

export async function getPdfs(): Promise<PdfItem[]> {
  const data = await request<PdfItem[]>("get", BASE)
  return Array.isArray(data) ? data : []
}

export async function getPdf(id: string): Promise<PdfItem> {
  return request<PdfItem>("get", `${BASE}/${id}`)
}

export async function uploadPdf(formData: FormData): Promise<PdfItem> {
  return request<PdfItem>("post", BASE, formData)
}

export function getPreviewUrl(id: string): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL
  if (!base) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set")
  const trimmed = base.replace(/\/$/, "")
  return `${trimmed}${BASE}/${id}/preview`
}

/**
 * URL for downloading a PDF by document id.
 * Backend: GET /api/v1/pdfs/:id/download (or {NEXT_PUBLIC_API_BASE_URL}/pdfs/:id/download).
 * Returns 200 with Content-Type: application/pdf and Content-Disposition: attachment; filename="<name>.pdf".
 * Use document._id with getDownloadUrl for download links (do not use pdfUrl).
 */
export function getDownloadUrl(id: string): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL
  if (!base) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set")
  const trimmed = base.replace(/\/$/, "")
  return `${trimmed}${BASE}/${id}/download`
}

export async function updatePdf(id: string, formData: FormData): Promise<PdfItem> {
  return request<PdfItem>("put", `${BASE}/${id}`, formData)
}

export async function deletePdf(id: string): Promise<{ deleted: boolean }> {
  return request<{ deleted: boolean }>("delete", `${BASE}/${id}`)
}
