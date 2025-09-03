"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/custom-toast"
import { getFullEvent, updateTime, getTime, getEvent } from "@/services/eventsService"
import type { EventDayItem, TimeEntry } from "@/types/eventsTypes"

export default function EditTimeSlotPage() {
  const { showToast } = useToast()
  const router = useRouter()
  const params = useParams() as { dayId?: string; timeId?: string }
  const dayId = params.dayId ?? ""
  const timeId = params.timeId ?? ""

  const [day, setDay] = useState<EventDayItem | null>(null)
  const [slot, setSlot] = useState<TimeEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ startTime: "", endTime: "", title: "", description: "", type: "event", location: "" })

  useEffect(() => {
    void load()
  }, [dayId, timeId])

  async function load() {
    setLoading(true)
    try {
      // Get all events and times to find the specific time slot
      const [events, allTimes] = await Promise.all([getEvent(), getTime()])
      
      // Find the time slot by ID
      const timeSlot = allTimes.find(t => t._id === timeId)
      if (!timeSlot) {
        showToast("Time slot not found", "error")
        router.replace("/admin/dashboard/events")
        return
      }

      // Find the event that contains this time slot
      const event = events.find(e => e._id === timeSlot.event_ref)
      if (!event) {
        showToast("Event not found", "error")
        router.replace("/admin/dashboard/events")
        return
      }

      // Get full event details to find the day
      const fullEvent = await getFullEvent(event._id)
      const eventDay = fullEvent?.days.find(d => d._id === dayId)
      
      if (!eventDay) {
        showToast("Event day not found", "error")
        router.replace("/admin/dashboard/events")
        return
      }

      setDay(eventDay)
      setSlot(timeSlot)
      
      // Populate form with existing data
      setForm({
        startTime: timeSlot.startTime,
        endTime: timeSlot.endTime,
        title: timeSlot.title,
        description: timeSlot.description,
        type: timeSlot.type,
        location: timeSlot.location
      })
    } catch (err: any) {
      showToast(err?.message ?? "Failed to load time slot", "error")
      router.replace("/admin/dashboard/events")
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!day || !slot) return
    setSaving(true)
    try {
      await updateTime(day._id, slot._id, form)
      showToast("Time slot updated", "success")
      router.replace("/admin/dashboard/events")
    } catch (err: any) {
      showToast(err?.message ?? "Failed to update", "error")
    } finally {
      setSaving(false)
    }
  }

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
          <h1 className="text-3xl font-bold tracking-tight">Edit Time Slot</h1>
          <p className="text-muted-foreground">Update the selected session.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/dashboard/events">Back to Events</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time *</Label>
                <Input id="startTime" type="time" value={form.startTime} onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))} required disabled={saving} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time *</Label>
                <Input id="endTime" type="time" value={form.endTime} onChange={(e) => setForm((p) => ({ ...p, endTime: e.target.value }))} required disabled={saving} />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required disabled={saving} />
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
              <Textarea id="description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} disabled={saving} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} disabled={saving} />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>{saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}</Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/dashboard/events">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

