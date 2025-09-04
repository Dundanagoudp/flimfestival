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

