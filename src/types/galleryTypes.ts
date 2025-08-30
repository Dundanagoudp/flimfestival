export interface GalleryYear {
  _id: string
  value: number
  name?: string
  active: boolean
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface CreateYearPayload {
  value: number
  name: string
}

export interface UpdateYearPayload {
  value: number
  name: string
}

export interface YearCreateResponse {
  message: string
  item: GalleryYear
}

export type YearsResponse = GalleryYear[]

export interface GalleryImage {
  _id: string
  photo: string
}

export interface YearwiseItem {
  year: number
  images: GalleryImage[]
}

export type YearwiseResponse = YearwiseItem[]

// Updated: This now represents the response from getallgallery endpoint
export interface GetAllGalleryResponse {
  year: number
  images: GalleryImage[]
}

export interface AddImagesResponse {
  message: string
  items?: GalleryImage[]
}

export interface BulkDeleteImagesRequest {
  imageIds: string[]
}

export interface SimpleMessageResponse {
  message: string
}
