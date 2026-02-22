export interface PdfItem {
  _id: string
  name?: string
  pdfUrl: string
  createdAt: string
  updatedAt: string
}

export interface PdfListResponse {
  success: true
  data: PdfItem[]
}

export interface PdfSingleResponse {
  success: true
  data: PdfItem
}

export interface PdfDeleteResponse {
  success: true
  data: { deleted: boolean }
}
