// Session Plan API types. Resources use both id and _id (same value).

export interface SessionPlanCategory {
  _id: string
  id: string
  name: string
  order?: number
  isVisible?: boolean
}

export interface SessionPlanSlot {
  _id: string
  id: string
  title: string
  startTime: string
  endTime?: string
  director?: string
  moderator?: string
  duration?: string
  category?: string // id or name from categories
  description?: string
  order?: number
  screenId?: string
}

export interface SessionPlanScreen {
  _id: string
  id: string
  screenName: string
  dayId?: string
  slots?: SessionPlanSlot[]
}

export interface SessionPlanDay {
  _id: string
  id: string
  dayNumber: number
  date: string
  sessionPlanId?: string
  screens?: SessionPlanScreen[]
}

export interface SessionPlan {
  _id: string
  id: string
  year: number
  festival: string
  isVisible?: boolean
  days?: SessionPlanDay[]
}

// Payloads for create/update
export interface CreateCategoryPayload {
  name: string
  order?: number
  isVisible?: boolean
}

export interface UpdateCategoryPayload {
  name?: string
  order?: number
  isVisible?: boolean
}

export interface CreatePlanPayload {
  year: number
  festival: string
  isVisible?: boolean
}

export interface UpdatePlanPayload {
  year?: number
  festival?: string
  isVisible?: boolean
}

export interface CreateDayPayload {
  dayNumber: number
  date: string
}

export interface UpdateDayPayload {
  dayNumber?: number
  date?: string
}

export interface CreateScreenPayload {
  screenName: string
}

export interface UpdateScreenPayload {
  screenName: string
}

export interface CreateSlotPayload {
  title: string
  startTime: string
  endTime?: string
  director?: string
  moderator?: string
  duration?: string
  category?: string
  description?: string
  order?: number
}

export interface UpdateSlotPayload {
  title?: string
  startTime?: string
  endTime?: string
  director?: string
  moderator?: string
  duration?: string
  category?: string
  description?: string
  order?: number
}
