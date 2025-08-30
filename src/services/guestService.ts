// Service layer for Guest/Year API

import apiClient from "@/apiClient"
import type {
  Guest,
  YearsResponse,
  YearMutationResponse,
  MessageResponse,
  GuestsYearwiseResponse,
  AllGuestsResponse,
  CreateOrUpdateYearInput,
  AddGuestInput,
  GuestMutationResponse,
  UpdateGuestInput,
  GuestsByYearResponse,
} from "@/types/guestTypes"

// Optional helper to set or clear Authorization at runtime if you don't use cookies.
export function setAuthToken(token?: string | null) {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete apiClient.defaults.headers.common.Authorization
  }
}

const BASE = "/api/v1/guest"

// Years

export async function getYears(): Promise<YearsResponse> {
  const { data } = await apiClient.get<YearsResponse>(`${BASE}/years`)
  return data
}

export async function createYear(input: CreateOrUpdateYearInput): Promise<YearMutationResponse> {
  const { data } = await apiClient.post<YearMutationResponse>(`${BASE}/createYear`, input)
  return data
}

export async function updateYear(id: string, input: CreateOrUpdateYearInput): Promise<YearMutationResponse> {
  const { data } = await apiClient.put<YearMutationResponse>(`${BASE}/years/${id}`, input)
  return data
}

export async function deleteYear(id: string): Promise<MessageResponse> {
  const { data } = await apiClient.delete<MessageResponse>(`${BASE}/years/${id}`)
  return data
}

// Guests

export async function addGuest(input: AddGuestInput): Promise<GuestMutationResponse> {
  const fd = new FormData()
  fd.append("name", input.name)
  fd.append("role", input.role)
  fd.append("year", input.year) // backend expects Year ObjectId here
  fd.append("age", String(input.age))
  fd.append("description", input.description)

  // If photo is a URL string, still append it as a string field; if File/Blob, append file.
  if (typeof input.photo === "string") {
    fd.append("photo", input.photo)
  } else {
    fd.append("photo", input.photo)
  }

  const { data } = await apiClient.post<GuestMutationResponse>(`${BASE}/addguests`, fd)
  return data
}

export async function updateGuest(id: string, input: UpdateGuestInput): Promise<GuestMutationResponse> {
  const fd = new FormData()

  if (typeof input.name !== "undefined") fd.append("name", input.name)
  if (typeof input.role !== "undefined") fd.append("role", input.role)
  if (typeof input.year !== "undefined") fd.append("year", input.year)
  if (typeof input.age !== "undefined") fd.append("age", String(input.age))
  if (typeof input.description !== "undefined") fd.append("description", input.description)
  if (typeof input.photo !== "undefined") {
    if (typeof input.photo === "string") {
      fd.append("photo", input.photo)
    } else {
      fd.append("photo", input.photo)
    }
  }

  const { data } = await apiClient.put<GuestMutationResponse>(`${BASE}/guests/${id}`, fd)
  return data
}

export async function getAllGuests(): Promise<AllGuestsResponse> {
  const { data } = await apiClient.get<AllGuestsResponse>(`${BASE}/allguests`)
  return data
}

export async function getGuestsYearwise(): Promise<GuestsYearwiseResponse> {
  const { data } = await apiClient.get<GuestsYearwiseResponse>(`${BASE}/guests-yearwise`)
  return data
}

export async function getGuestsByYearId(yearId: string): Promise<GuestsByYearResponse> {
  const { data } = await apiClient.get<GuestsByYearResponse>(`${BASE}/guests/year/${yearId}`)
  return data
}

export async function getGuestById(id: string): Promise<Guest> {
  // API returns a single Guest object for this route
  const { data } = await apiClient.get<Guest>(`${BASE}/guests/${id}`)
  return data
}

export async function deleteGuest(id: string): Promise<MessageResponse> {
  const { data } = await apiClient.delete<MessageResponse>(`${BASE}/guests/${id}`)
  return data
}

