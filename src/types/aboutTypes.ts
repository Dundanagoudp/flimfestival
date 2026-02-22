// About Us - Banner Types
export interface AboutBanner {
  id?: string
  _id?: string
  title: string
  backgroundImage: string
}

export interface CreateBannerPayload {
  title: string
  backgroundImage: File
}

export interface UpdateBannerPayload {
  title?: string
  backgroundImage?: File
}

export interface DeleteResponse {
  id: string
}

// About Us - Statistics Types
export interface AboutStatistics {
  id?: string
  _id?: string
  years: number
  films: number
  countries: number
  image: string
}

export interface CreateStatisticsPayload {
  years: number | string
  films: number | string
  countries: number | string
  image: File
}

export interface UpdateStatisticsPayload {
  years?: number | string
  films?: number | string
  countries?: number | string
  image?: File
}

// About Us - Introduction Types
export interface AboutIntroduction {
  id?: string
  _id?: string
  title: string
  description: string
  image: string
}

export interface CreateIntroductionPayload {
  title: string
  description: string
  image?: File
}

export interface UpdateIntroductionPayload {
  title?: string
  description?: string
  image?: File
}

// About Us - Items (scrollable section); each item has multiple images
export interface AboutItem {
  id: string
  index: number
  title: string
  subtitle?: string
  description?: string
  images?: string[]
}

export interface CreateAboutItemPayload {
  title: string
  index?: number
  subtitle?: string
  description?: string
  images?: File[]
}

export interface UpdateAboutItemPayload {
  title?: string
  index?: number
  subtitle?: string
  description?: string
  images?: File[]
  removeImageIndices?: number[]
}

