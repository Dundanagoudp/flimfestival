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

const BASE = "/guest"

// Years

export async function getYears(): Promise<YearsResponse> {
  try {
    const { data } = await apiClient.get<YearsResponse>(`${BASE}/years`)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to get years")
  }
}

export async function createYear(input: CreateOrUpdateYearInput): Promise<YearMutationResponse> {
  try {
    const { data } = await apiClient.post<YearMutationResponse>(`${BASE}/createYear`, input)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to create year")
  }
}

export async function updateYear(id: string, input: CreateOrUpdateYearInput): Promise<YearMutationResponse> {
  try {
    const { data } = await apiClient.put<YearMutationResponse>(`${BASE}/years/${id}`, input)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to update year")
  }
}

export async function deleteYear(id: string): Promise<MessageResponse> {
  try {
    const { data } = await apiClient.delete<MessageResponse>(`${BASE}/years/${id}`)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to delete year")
  }
}

// Guests

export async function addGuest(input: AddGuestInput): Promise<GuestMutationResponse> {
  try {
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
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to add guest")
  }
}

export async function updateGuest(id: string, input: UpdateGuestInput): Promise<GuestMutationResponse> {
  try {
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
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to update guest")
  }
}

export async function getAllGuests(): Promise<AllGuestsResponse> {
  try {
    const { data } = await apiClient.get<AllGuestsResponse>(`${BASE}/allguests`)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to get all guests")
  }
}

export async function getGuestsYearwise(): Promise<GuestsYearwiseResponse> {
  try {
    const { data } = await apiClient.get<GuestsYearwiseResponse>(`${BASE}/guests-yearwise`)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to get guests yearwise")
  }
}

export async function getGuestsByYearId(yearId: string): Promise<GuestsByYearResponse> {
  try {
    const { data } = await apiClient.get<GuestsByYearResponse>(`${BASE}/guests/year/${yearId}`)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to get guests by year")
  }
}

export async function getGuestById(id: string): Promise<Guest> {
  try {
    // API returns a single Guest object for this route
    const { data } = await apiClient.get<Guest>(`${BASE}/guests/${id}`)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to get guest")
  }
}

export async function deleteGuest(id: string): Promise<MessageResponse> {
  try {
    const { data } = await apiClient.delete<MessageResponse>(`${BASE}/guests/${id}`)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to delete guest")
  }
}

