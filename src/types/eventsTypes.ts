// Events Schedule Types

// Core Entities
export interface EventItem {
  _id: string
  name: string
  description: string
  year: number
  month: number
  startDate: string
  endDate: string
  totalDays: number
  // Optional fields provided by backend when available
  location?: string
  image?: string
  updatedAt: string
  __v: number
}

export interface EventDayItem {
  _id: string
  event_ref: string
  dayNumber: number
  name: string
  description: string
  createdAt: string
  updatedAt: string
  __v: number
  image?: string
  times?: TimeEntry[]
}

export interface TimeEntry {
  _id: string
  event_ref: string
  day_ref: string
  startTime: string
  endTime: string
  title: string
  description: string
  type: string
  location: string
  __v: number
  updatedAt?: string
}

// Payloads
export interface CreateEventPayload {
  name: string
  description: string
  year: number
  month: number
  startDate: string // ISO string
  endDate: string // ISO string
  // Optional extras supported by backend when using multipart
  location?: string
}

export interface UpdateEventDayPayload {
  name?: string
  description?: string
}

export interface AddTimePayload {
  startTime: string // HH:mm
  endTime: string // HH:mm
  title: string
  description: string
  type: string
  location: string
}

export interface UpdateTimePayload {
  startTime?: string
  endTime?: string
  title?: string
  description?: string
  type?: string
  location?: string
}

// API Responses
export interface CreateEventResponse {
  success: boolean
  eventId: string
}

export interface SimpleMessageResponse {
  message: string
}

export type GetEventsResponse = EventItem[]
export type GetEventDaysResponse = EventDayItem[]
export type GetTimesResponse = TimeEntry[]

export interface GetFullEventResponse {
  event: EventItem
  days: EventDayItem[]
}

export type GetTotalEventResponse = { totalEvents: number } | number

