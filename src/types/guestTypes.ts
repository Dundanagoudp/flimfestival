// Types for Guest/Year API

export interface Year {
  _id: string
  value: number
  name?: string // Added based on API response
  active: boolean
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface Guest {
  _id: string
  name: string
  role: string
  // The API sometimes returns the Year as an ObjectId string (on create),
  // and sometimes as the numeric year (on GET by id/yearwise).
  year: string | number
  age: number
  description: string
  photo: string
  createdAt?: string
  updatedAt?: string
  __v?: number
}

// Responses

export interface MessageResponse {
  message: string
}

export interface YearMutationResponse extends MessageResponse {
  year: Year
}

export interface GuestMutationResponse extends MessageResponse {
  guest: Guest
}

export type YearsResponse = Year[] // GET /guest/years
export type AllGuestsResponse = Guest[] // GET /guest/allguests

export interface GuestsYearwiseItem {
  year: number
  guests: Guest[]
}
export type GuestsYearwiseResponse = GuestsYearwiseItem[] // GET /guest/guests-yearwise

// Inputs

export interface CreateOrUpdateYearInput {
  value: number
  name?: string // Added based on API response structure
}

export interface AddGuestInput {
  name: string
  role: string
  year: string // Year ObjectId (as used by addguests)
  age: number
  description: string
  // The API expects multipart/form-data. Accept a File/Blob or an existing URL string.
  photo: File | Blob | string
}

export interface UpdateGuestInput {
  name?: string
  role?: string
  // backend expects Year ObjectId here
  year?: string
  age?: number
  description?: string
  // Accept new file/blob or keep existing URL string
  photo?: File | Blob | string
}

export interface GuestsByYearResponse {
  year: number
  guests: Guest[]
}

export type CreateYearPayload = CreateOrUpdateYearInput
export type YearCreateResponse = YearMutationResponse
