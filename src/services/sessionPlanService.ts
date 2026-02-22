import apiClient from "@/apiClient"
import type {
  SessionPlanCategory,
  SessionPlan,
  SessionPlanDay,
  SessionPlanScreen,
  SessionPlanSlot,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  CreatePlanPayload,
  UpdatePlanPayload,
  CreateDayPayload,
  UpdateDayPayload,
  CreateScreenPayload,
  UpdateScreenPayload,
  CreateSlotPayload,
  UpdateSlotPayload,
} from "@/types/sessionPlanTypes"

const BASE = "/session-plans"

interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

async function request<T>(
  method: "get" | "post" | "put" | "delete",
  path: string,
  body?: object
): Promise<T> {
  try {
    const response = await apiClient.request<ApiResponse<T>>({
      method,
      url: path,
      data: body,
    })
    const res = response.data
    if (!res.success || res.error) {
      throw new Error(res.error || "Request failed")
    }
    return res.data as T
  } catch (err: any) {
    const msg =
      err?.response?.data?.error ||
      err?.message ||
      "Session plan request failed"
    throw new Error(msg)
  }
}

// Categories
export async function getCategories(
  visible?: boolean
): Promise<SessionPlanCategory[]> {
  const q = visible !== undefined ? `?visible=${visible}` : ""
  return request<SessionPlanCategory[]>("get", `${BASE}/categories${q}`)
}

export async function getCategory(id: string): Promise<SessionPlanCategory> {
  return request<SessionPlanCategory>("get", `${BASE}/categories/${id}`)
}

export async function createCategory(
  body: CreateCategoryPayload
): Promise<SessionPlanCategory> {
  return request<SessionPlanCategory>("post", `${BASE}/categories`, body)
}

export async function updateCategory(
  id: string,
  body: UpdateCategoryPayload
): Promise<SessionPlanCategory> {
  return request<SessionPlanCategory>("put", `${BASE}/categories/${id}`, body)
}

export async function deleteCategory(id: string): Promise<{ deleted: boolean }> {
  return request<{ deleted: boolean }>("delete", `${BASE}/categories/${id}`)
}

// Plans
export async function getPlans(visible?: boolean): Promise<SessionPlan[]> {
  const q = visible !== undefined ? `?visible=${visible}` : ""
  return request<SessionPlan[]>("get", `${BASE}${q}`)
}

export async function getPlan(planId: string): Promise<SessionPlan> {
  return request<SessionPlan>("get", `${BASE}/${planId}`)
}

export async function createPlan(
  body: CreatePlanPayload
): Promise<SessionPlan> {
  return request<SessionPlan>("post", BASE, body)
}

export async function updatePlan(
  planId: string,
  body: UpdatePlanPayload
): Promise<SessionPlan> {
  return request<SessionPlan>("put", `${BASE}/${planId}`, body)
}

export async function deletePlan(
  planId: string
): Promise<{ deleted: boolean }> {
  return request<{ deleted: boolean }>("delete", `${BASE}/${planId}`)
}

// Days
export async function getDays(planId: string): Promise<SessionPlanDay[]> {
  return request<SessionPlanDay[]>("get", `${BASE}/${planId}/days`)
}

export async function getDay(
  planId: string,
  dayId: string
): Promise<SessionPlanDay> {
  return request<SessionPlanDay>("get", `${BASE}/${planId}/days/${dayId}`)
}

export async function createDay(
  planId: string,
  body: CreateDayPayload
): Promise<SessionPlanDay> {
  return request<SessionPlanDay>("post", `${BASE}/${planId}/days`, body)
}

export async function updateDay(
  planId: string,
  dayId: string,
  body: UpdateDayPayload
): Promise<SessionPlanDay> {
  return request<SessionPlanDay>(
    "put",
    `${BASE}/${planId}/days/${dayId}`,
    body
  )
}

export async function deleteDay(
  planId: string,
  dayId: string
): Promise<{ deleted: boolean }> {
  return request<{ deleted: boolean }>(
    "delete",
    `${BASE}/${planId}/days/${dayId}`
  )
}

// Screens
export async function getScreens(
  planId: string,
  dayId: string
): Promise<SessionPlanScreen[]> {
  return request<SessionPlanScreen[]>(
    "get",
    `${BASE}/${planId}/days/${dayId}/screens`
  )
}

export async function getScreen(
  planId: string,
  dayId: string,
  screenId: string
): Promise<SessionPlanScreen> {
  return request<SessionPlanScreen>(
    "get",
    `${BASE}/${planId}/days/${dayId}/screens/${screenId}`
  )
}

export async function createScreen(
  planId: string,
  dayId: string,
  body: CreateScreenPayload
): Promise<SessionPlanScreen> {
  return request<SessionPlanScreen>(
    "post",
    `${BASE}/${planId}/days/${dayId}/screens`,
    body
  )
}

export async function updateScreen(
  planId: string,
  dayId: string,
  screenId: string,
  body: UpdateScreenPayload
): Promise<SessionPlanScreen> {
  return request<SessionPlanScreen>(
    "put",
    `${BASE}/${planId}/days/${dayId}/screens/${screenId}`,
    body
  )
}

export async function deleteScreen(
  planId: string,
  dayId: string,
  screenId: string
): Promise<{ deleted: boolean }> {
  return request<{ deleted: boolean }>(
    "delete",
    `${BASE}/${planId}/days/${dayId}/screens/${screenId}`
  )
}

// Slots
export async function getSlots(
  planId: string,
  dayId: string,
  screenId: string
): Promise<SessionPlanSlot[]> {
  return request<SessionPlanSlot[]>(
    "get",
    `${BASE}/${planId}/days/${dayId}/screens/${screenId}/slots`
  )
}

export async function getSlot(
  planId: string,
  dayId: string,
  screenId: string,
  slotId: string
): Promise<SessionPlanSlot> {
  return request<SessionPlanSlot>(
    "get",
    `${BASE}/${planId}/days/${dayId}/screens/${screenId}/slots/${slotId}`
  )
}

export async function createSlot(
  planId: string,
  dayId: string,
  screenId: string,
  body: CreateSlotPayload
): Promise<SessionPlanSlot> {
  return request<SessionPlanSlot>(
    "post",
    `${BASE}/${planId}/days/${dayId}/screens/${screenId}/slots`,
    body
  )
}

export async function updateSlot(
  planId: string,
  dayId: string,
  screenId: string,
  slotId: string,
  body: UpdateSlotPayload
): Promise<SessionPlanSlot> {
  return request<SessionPlanSlot>(
    "put",
    `${BASE}/${planId}/days/${dayId}/screens/${screenId}/slots/${slotId}`,
    body
  )
}

export async function deleteSlot(
  planId: string,
  dayId: string,
  screenId: string,
  slotId: string
): Promise<{ deleted: boolean }> {
  return request<{ deleted: boolean }>(
    "delete",
    `${BASE}/${planId}/days/${dayId}/screens/${screenId}/slots/${slotId}`
  )
}
