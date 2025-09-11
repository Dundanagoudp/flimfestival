import apiClient from "@/apiClient"
import {
  AddTimePayload,
  CreateEventPayload,
  CreateEventResponse,
  EventDayItem,
  EventItem,
  GetEventDaysResponse,
  GetEventsResponse,
  GetFullEventResponse,
  GetTimesResponse,
  LatestEventResponse,
  SimpleMessageResponse,
  UpdateEventDayPayload,
  UpdateTimePayload,
} from "@/types/eventsTypes"
import { RegistrationData, RegistrationResponse } from "@/types/registartionTypes"

const BASE = "/events-schedule"

// Create Event (supports multipart with optional image & location)
export async function addEvent(payload: CreateEventPayload & { imageFile?: File | null }) {
  try {
    const hasFile = Boolean(payload.imageFile)
    if (hasFile) {
      const form = new FormData()
      form.append("name", payload.name)
      form.append("description", payload.description)
      form.append("year", String(payload.year))
      form.append("month", String(payload.month))
      form.append("startDate", payload.startDate)
      form.append("endDate", payload.endDate)
      if (payload.location) form.append("location", payload.location)
      if (payload.imageFile) form.append("image", payload.imageFile)
      const { data } = await apiClient.post<CreateEventResponse>(`${BASE}/addEvent`, form)
      return data
    }
    const { imageFile, ...json } = payload
    const { data } = await apiClient.post<CreateEventResponse>(`${BASE}/addEvent`, json)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to create event")
  }
}

// Update Event (supports multipart with optional image & location)
export async function updateEvent(
  eventId: string,
  payload: Partial<CreateEventPayload> & { imageFile?: File | null },
) {
  try {
    const hasFile = Boolean(payload.imageFile)
    if (hasFile) {
      const form = new FormData()
      if (payload.name !== undefined) form.append("name", payload.name)
      if (payload.description !== undefined) form.append("description", payload.description)
      if (payload.year !== undefined) form.append("year", String(payload.year))
      if (payload.month !== undefined) form.append("month", String(payload.month))
      if (payload.startDate !== undefined) form.append("startDate", payload.startDate)
      if (payload.endDate !== undefined) form.append("endDate", payload.endDate)
      if (payload.location) form.append("location", payload.location)
      if (payload.imageFile) form.append("image", payload.imageFile)
      const { data } = await apiClient.put<{ message: string; event: EventItem }>(
        `${BASE}/updateEvent/${eventId}`,
        form,
      )
      return data
    }
    const { imageFile, ...json } = payload
    const { data } = await apiClient.put<{ message: string; event: EventItem }>(
      `${BASE}/updateEvent/${eventId}`,
      json,
    )
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to update event")
  }
}

// Get events
export async function getEvent() {
  try {
    const { data } = await apiClient.get<GetEventsResponse>(`${BASE}/getEvent`)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to get events")
  }
}

// Get single event by id (helper from list if backend lacks endpoint)
export async function getEventById(eventId: string) {
  const events = await getEvent()
  return events.find((e) => e._id === eventId) || null
}

// Get total events (backend may return number or object)
export async function getTotalEvent() {
  try {
    const { data } = await apiClient.get(`${BASE}/totalEvent`)
    return data as number | { totalEvents: number }
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to get total events")
  }
}

// Get days for an event
export async function getEventDay(eventId: string) {
  try {
    const { data } = await apiClient.get<GetEventDaysResponse>(`${BASE}/getEventDay`, {
      params: { eventId },
    })
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to get event days")
  }
}

// Update event day basic fields
export async function updateEventDay(eventDayId: string, payload: UpdateEventDayPayload) {
  try {
    const { data } = await apiClient.put<SimpleMessageResponse>(`${BASE}/updateEventDay/${eventDayId}`, payload)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to update event day")
  }
}

// Update event day with image
export async function updateEventDayWithImage(eventDayId: string, image: File) {
  try {
    const form = new FormData()
    form.append("image", image)
    const { data } = await apiClient.put<{
      message: string
      day?: EventDayItem
    }>(`${BASE}/updateEventDayWithImage/${eventDayId}`, form)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to update day image")
  }
}

// Upload event day image only
export async function uploadEventDayImage(eventDayId: string, image: File) {
  try {
    const form = new FormData()
    form.append("image", image)
    const { data } = await apiClient.post<{ message: string; image: string }>(
      `${BASE}/uploadEventDayImage/${eventDayId}`,
      form,
    )
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to upload day image")
  }
}

// Add time to a day
export async function addTime(eventId: string, eventDay_ref: string, payload: AddTimePayload) {
  try {
    const { data } = await apiClient.post<SimpleMessageResponse>(
      `${BASE}/addTime/${eventId}/day/${eventDay_ref}`,
      payload,
    )
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to add time entry")
  }
}

// Update a time entry
export async function updateTime(day_ref: string, timeId: string, payload: UpdateTimePayload) {
  try {
    const { data } = await apiClient.put<SimpleMessageResponse>(
      `${BASE}/updateTime/day/${day_ref}/time/${timeId}`,
      payload,
    )
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to update time entry")
  }
}

// Delete a time entry
export async function deleteTime(timeId: string) {
  try {
    const { data } = await apiClient.delete<SimpleMessageResponse>(`${BASE}/deleteTime/${timeId}`)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to delete time entry")
  }
}

// Delete an event (and cascade on backend)
export async function deleteEvent(eventId: string) {
  try {
    const { data } = await apiClient.delete<{
      message: string
      deletedEvent: string
      deletedEventDays: number
      deletedTimeEntries: number
    }>(`${BASE}/deleteEvent/${eventId}`)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to delete event")
  }
}

// Get times list
export async function getTime() {
  try {
    const { data } = await apiClient.get<GetTimesResponse>(`${BASE}/getTime`)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to get times")
  }
}

// Get full event details
export async function getFullEvent(eventId: string) {
  try {
    const { data } = await apiClient.get<GetFullEventResponse>(`${BASE}/getFullEvent`, {
      params: { eventId },
    })
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to get full event details")
  }
}

// Delete event day image
export async function deleteEventDayImage(eventDayId: string) {
  try {
    const { data } = await apiClient.delete<SimpleMessageResponse>(`${BASE}/deleteEventDayImage/${eventDayId}`)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to delete event day image")
  }
}
export async  function registerEvent(registrationData: RegistrationData){
  try{
 const response= await apiClient.post<RegistrationResponse>(`/registration/createRegistration`, registrationData)
 return response.data
  }
  catch(err:any){
    throw new Error(err?.response?.data?.message || err?.message || "Failed to register for event")
  }
}

export async function getlatestEvent() {
  try {
    const { data } = await apiClient.get(`${BASE}/today-or-latest`)
    return data as number | { totalEvents: number }
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to get total events")
  }
}
export async function getLatestEvent(): Promise<LatestEventResponse> {
  try {
    const { data } = await apiClient.get<LatestEventResponse>(`${BASE}/today-or-latest`)
    return data
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error?.message || "Failed to get latest event")
  }
}