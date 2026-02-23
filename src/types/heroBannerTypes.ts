export interface HeroBanner {
  _id: string
  video?: string
  title: string
  subtitle: string
  createdAt: string
  updatedAt: string
}

export interface HeroBannerApiResponse {
  success: true
  data: HeroBanner
}

export interface HeroBannerCreatePayload {
  video?: File
  title: string
  subtitle: string
}

export interface HeroBannerUpdatePayload {
  video?: File
  title?: string
  subtitle?: string
}
