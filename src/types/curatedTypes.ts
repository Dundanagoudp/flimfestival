// Curated category (admin + public list)
export interface CuratedCategory {
  _id: string
  name: string
  slug?: string
  public: boolean
  order: number
  createdAt?: string
  updatedAt?: string
  __v?: number
}

// Curated image (category can be populated object)
export interface CuratedCategoryRef {
  _id: string
  name: string
  slug?: string
  public: boolean
  order: number
  createdAt?: string
  updatedAt?: string
  __v?: number
}

export interface CuratedImage {
  _id: string
  category: CuratedCategoryRef | CuratedCategory | string
  image: string
  title: string
  order: number
  jury_name?: string
  designation?: string
  short_bio?: string
  full_biography?: string
  film_synopsis?: string
  display_order?: number
  status?: string
  createdAt?: string
  updatedAt?: string
}

// Create/Update category payload
export interface CreateCuratedCategoryPayload {
  name: string
  slug?: string
  public?: boolean
  order?: number
}

export type UpdateCuratedCategoryPayload = Partial<CreateCuratedCategoryPayload>

// List categories response (API returns { categories: [...] })
export interface CuratedCategoriesResponse {
  categories: CuratedCategory[]
}

// Get images by category response (API returns { images: [...] } only)
export interface CuratedImagesByCategoryResponse {
  images: CuratedImage[]
}

// Update image (JSON body when not uploading new file)
export interface UpdateCuratedImagePayload {
  title?: string
  order?: number
  category?: string
  jury_name?: string
  designation?: string
  short_bio?: string
  full_biography?: string
  film_synopsis?: string
  display_order?: number
  status?: string
}

// Grouped images (public API: one item per category with its images)
export interface CuratedGroupedImage {
  _id: string
  image: string
  title?: string
  order: number
  jury_name?: string
  designation?: string
  short_bio?: string
  full_biography?: string
  film_synopsis?: string
  display_order?: number
  status?: string
  createdAt?: string
  updatedAt?: string
  category?: CuratedCategoryRef
}

export interface CuratedGroupedItem {
  category: CuratedCategoryRef
  images: CuratedGroupedImage[]
}

// API returns { grouped: [...] }
export interface CuratedGroupedResponse {
  grouped: CuratedGroupedItem[]
}
