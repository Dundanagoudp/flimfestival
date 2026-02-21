// Curated category (admin + public list)
export interface CuratedCategory {
  _id: string
  name: string
  subtitle?: string
  order: number
  isVisible: boolean
  createdAt?: string
  updatedAt?: string
}

// Curated image (category can be populated object)
export interface CuratedCategoryRef {
  _id: string
  name: string
  subtitle?: string
  order: number
}

export interface CuratedImage {
  _id: string
  category: CuratedCategoryRef | CuratedCategory
  image: string
  title?: string
  order: number
  createdAt?: string
  updatedAt?: string
}

// Create/Update category payload
export interface CreateCuratedCategoryPayload {
  name: string
  subtitle?: string
  order?: number
  isVisible?: boolean
}

export type UpdateCuratedCategoryPayload = Partial<CreateCuratedCategoryPayload>

// List categories response
export type CuratedCategoriesResponse = CuratedCategory[]

// Get images by category response
export interface CuratedImagesByCategoryResponse {
  category: CuratedCategory
  images: CuratedImage[]
}

// Update image (JSON body when not uploading new file)
export interface UpdateCuratedImagePayload {
  title?: string
  order?: number
  category?: string
}
