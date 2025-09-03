"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Loader2, Save } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/components/ui/custom-toast"
import { addTime, getEvent, getEventDay, getFullEvent } from "@/services/eventsService"
import type { EventDayItem, EventItem } from "@/types/eventsTypes"

export default function AddTimeSlotPage() {
  const { showToast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [events, setEvents] = useState<EventItem[]>([])
  const [days, setDays] = useState<EventDayItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    eventId: "",
    eventDay_ref: "",
    startTime: "",
    endTime: "",
    title: "",
    description: "",
    type: "event",
    location: "",
  })

  useEffect(() => {
    void load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const evs = await getEvent()
      setEvents(evs)
      // Read deep link params
      const qpEventId = searchParams?.get("eventId") || ""
      const qpDayId = searchParams?.get("dayId") || ""

      const initialEvent = (qpEventId && evs.find(e => e._id === qpEventId)) || evs?.[0]
      if (initialEvent) {
        const fetchedDays = await getEventDay(initialEvent._id)
        setDays(fetchedDays)
        const initialDay = (qpDayId && fetchedDays.find(d => d._id === qpDayId)) || fetchedDays?.[0]
        setForm((p) => ({ ...p, eventId: initialEvent._id, eventDay_ref: initialDay?._id || "" }))
      }
    } catch (err: any) {
      showToast(err?.message ?? "Failed to load events", "error")
    } finally {
      setLoading(false)
    }
  }

  async function handleEventChange(eventId: string) {
    setForm((p) => ({ ...p, eventId, eventDay_ref: "" }))
    try {
      const fetchedDays = await getEventDay(eventId)
      setDays(fetchedDays)
      // Auto-select first day for convenience
      if (fetchedDays.length > 0) {
        const firstDayId = fetchedDays[0]._id
        setForm((p) => ({ ...p, eventDay_ref: firstDayId }))
        // reflect in URL
        const qp = new URLSearchParams(window.location.search)
        qp.set("eventId", eventId)
        qp.set("dayId", firstDayId)
        router.replace(`/admin/dashboard/events/add-time?${qp.toString()}`)
      } else {
        // No days available for this event
        setForm((p) => ({ ...p, eventDay_ref: "" }))
        const qp = new URLSearchParams(window.location.search)
        qp.set("eventId", eventId)
        qp.delete("dayId")
        router.replace(`/admin/dashboard/events/add-time?${qp.toString()}`)
        showToast("Selected event has no days. Please create days first.", "warning")
      }
    } catch (err: any) {
      showToast(err?.message ?? "Failed to load days", "error")
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.eventId || !form.eventDay_ref) {
      showToast("Select event and day", "warning")
      return
    }
    setSubmitting(true)
    try {
      await addTime(form.eventId, form.eventDay_ref, {
        startTime: form.startTime,
        endTime: form.endTime,
        title: form.title,
        description: form.description,
        type: form.type,
        location: form.location,
      })
      showToast("Time slot added", "success")
      setForm((p) => ({ ...p, startTime: "", endTime: "", title: "", description: "", location: "" }))
      // Navigate back to events page with this event pre-selected
      router.push(`/admin/dashboard/events?eventId=${form.eventId}`)
    } catch (err: any) {
      showToast(err?.message ?? "Failed to add time slot", "error")
    } finally {
      setSubmitting(false)
    }
  }

  const selectedEvent = useMemo(() => events.find((e) => e._id === form.eventId) ?? null, [events, form.eventId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Time Slot</h1>
          <p className="text-muted-foreground">Create a new session for a specific day.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/dashboard/events">Back to Events</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" /> Time Slot Details
          </CardTitle>
          <CardDescription>Fill in details and save.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Event *</Label>
                <Select value={form.eventId} onValueChange={(v) => handleEventChange(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map((e) => (
                      <SelectItem key={e._id} value={e._id}>{e.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Event Day *</Label>
                <Select
                  value={form.eventDay_ref}
                  onValueChange={(v) => {
                    setForm((p) => ({ ...p, eventDay_ref: v }))
                    const qp = new URLSearchParams(window.location.search)
                    if (form.eventId) qp.set("eventId", form.eventId)
                    qp.set("dayId", v)
                    router.replace(`/admin/dashboard/events/add-time?${qp.toString()}`)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map((d) => (
                      <SelectItem key={d._id} value={d._id}>Day {d.dayNumber}: {d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time *</Label>
                <Input id="startTime" name="startTime" type="time" value={form.startTime} onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))} required disabled={submitting} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time *</Label>
                <Input id="endTime" name="endTime" type="time" value={form.endTime} onChange={(e) => setForm((p) => ({ ...p, endTime: e.target.value }))} required disabled={submitting} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required disabled={submitting} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="panel">Panel</SelectItem>
                    <SelectItem value="break">Break</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} disabled={submitting} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} disabled={submitting} />
            </div>

            {selectedEvent && (
              <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground">
                Selected event: {selectedEvent.name}
              </div>
            )}

            <Button type="submit" disabled={submitting}>
              {submitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>) : (<><Save className="mr-2 h-4 w-4" /> Add Time Slot</>)}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

