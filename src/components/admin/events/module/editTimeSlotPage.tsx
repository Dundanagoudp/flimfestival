"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Clock } from "lucide-react"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Edit Time Slot
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Update the selected session details</p>
          </div>
          <Button variant="outline" asChild className="w-full sm:w-auto border-slate-300 dark:border-slate-600">
            <Link href="/admin/dashboard/events">Back to Events</Link>
          </Button>
        </div>

        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Clock className="h-5 w-5 text-purple-600" /> Edit Session Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-slate-700 dark:text-slate-300 font-medium">Start Time *</Label>
                  <Input 
                    id="startTime" 
                    type="time" 
                    value={form.startTime} 
                    onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))} 
                    required 
                    disabled={saving}
                    className="border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime" className="text-slate-700 dark:text-slate-300 font-medium">End Time *</Label>
                  <Input 
                    id="endTime" 
                    type="time" 
                    value={form.endTime} 
                    onChange={(e) => setForm((p) => ({ ...p, endTime: e.target.value }))} 
                    required 
                    disabled={saving}
                    className="border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                  />
                </div>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-slate-700 dark:text-slate-300 font-medium">Title *</Label>
                  <Input 
                    id="title" 
                    value={form.title} 
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} 
                    required 
                    disabled={saving}
                    className="border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                    placeholder="Enter session title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-slate-700 dark:text-slate-300 font-medium">Type *</Label>
                  <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v }))}>
                    <SelectTrigger className="border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400">
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
                <Label htmlFor="description" className="text-slate-700 dark:text-slate-300 font-medium">Description</Label>
                <Textarea 
                  id="description" 
                  value={form.description} 
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} 
                  rows={3} 
                  disabled={saving}
                  className="border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                  placeholder="Describe the session..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location" className="text-slate-700 dark:text-slate-300 font-medium">Location</Label>
                <Input 
                  id="location" 
                  value={form.location} 
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} 
                  disabled={saving}
                  className="border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                  placeholder="Enter location (optional)"
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={saving}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  asChild
                  className="border-slate-300 dark:border-slate-600"
                >
                  <Link href="/admin/dashboard/events">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

