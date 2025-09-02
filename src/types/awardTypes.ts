// Award Types
export interface Award {
  _id: string
  title: string
  description: string
  image: string
  array_images: string[]
  rule1: string
  rule2: string
  rule3: string
  category: AwardCategory | string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface AwardCategory {
  _id: string
  name: string
  createdAt?: string
  updatedAt?: string
  __v?: number
}

export interface CreateAwardPayload {
  title: string
  description: string
  image: File
  array_images: File[]
  rule1: string
  rule2: string
  rule3: string
  category: string
}

export interface UpdateAwardPayload {
  title?: string
  description?: string
  image?: File
  array_images?: File[]
  rule1?: string
  rule2?: string
  rule3?: string
  category?: string
}

// Category Management Types
export interface CreateCategoryPayload {
  name: string
}

export interface UpdateCategoryPayload {
  name: string
}

// API Response Types
export interface AwardCreateResponse {
  _id: string
  category: AwardCategory
}

export interface GetAllAwardsResponse extends Array<Award> {}

export interface GetAwardByIdResponse extends Award {}

export interface AwardUpdateResponse {
  _id: string
  title: string
  description: string
  image: string
  array_images: string[]
  rule1: string
  rule2: string
  rule3: string
  category: AwardCategory | string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface AwardDeleteResponse {
  message: string
}

export interface SimpleMessageResponse {
  message: string
}

// Category API Response Types
export interface CategoryCreateResponse extends AwardCategory {}

export interface GetAllCategoriesResponse extends Array<AwardCategory> {}
