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

// Day (year → days → images)
export interface GalleryDay {
  _id: string
  year: string
  name: string
  date?: string
  order?: number
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface CreateDayPayload {
  yearId: string
  name: string
  date?: string
  order?: number
}

export interface UpdateDayPayload {
  name?: string
  date?: string
  order?: number
}

export interface DayCreateResponse {
  message: string
  item: GalleryDay
}

export interface DayUpdateResponse {
  message: string
  item: GalleryDay
}

export type DaysResponse = GalleryDay[]

export interface GalleryImage {
  _id: string
  photo: string
  caption?: string
  day?: string | GalleryDay
}

export interface YearwiseItem {
  year: number
  images: GalleryImage[]
}

export type YearwiseResponse = YearwiseItem[]

// Response when fetching gallery by year (no dayId): days + imagesWithoutDay
export interface GalleryDayWithImages {
  _id: string
  name: string
  date?: string
  order?: number
  images: GalleryImage[]
}

export interface GetAllGalleryByYearResponse {
  year: number
  days: GalleryDayWithImages[]
  imagesWithoutDay: GalleryImage[]
}

// Response when fetching gallery by year + dayId: single day's images
export interface GetAllGalleryByDayResponse {
  year: number
  dayId: string
  images: GalleryImage[]
}

// Union for getallgallery; callers can narrow by usage
export type GetAllGalleryResponse = GetAllGalleryByYearResponse | GetAllGalleryByDayResponse

// Legacy flat shape for backward compatibility where backend might still return it
export interface GetAllGalleryLegacyResponse {
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
