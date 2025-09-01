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
  __v: number
}

export interface CreateAwardPayload {
  title: string
  description: string
  image: File
  array_images: File[]
  rule1: string
  rule2: string
  rule3: string
}

export interface UpdateAwardPayload {
  title?: string
  description?: string
  image?: File
  array_images?: File[]
  rule1?: string
  rule2?: string
  rule3?: string
}

// API Response Types
export interface AwardCreateResponse {
  _id: string
  title: string
  description: string
  image: string
  array_images: string[]
  rule1: string
  rule2: string
  rule3: string
  __v: number
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
  __v: number
}

export interface AwardDeleteResponse {
  message: string
}

export interface SimpleMessageResponse {
  message: string
}
