"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Loader2, Save } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/custom-toast"
import { getEvent, getFullEvent } from "@/services/eventsService"
import type { EventItem } from "@/types/eventsTypes"

export default function EditEventPage() {
  const { showToast } = useToast()
  const router = useRouter()
  const params = useParams() as { id?: string }
  const id = params.id ?? ""
  const [event, setEvent] = useState<EventItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: "", description: "", year: new Date().getFullYear(), month: new Date().getMonth() + 1, startDate: "", endDate: "" })

  useEffect(() => {
    void load()
  }, [id])

  async function load() {
    setLoading(true)
    try {
      const evs = await getEvent()
      const curr = evs.find((e) => e._id === id) ?? null
      if (!curr) throw new Error("Event not found")
      setEvent(curr)
      setForm({ name: curr.name, description: curr.description, year: curr.year, month: curr.month, startDate: curr.startDate.slice(0, 16), endDate: curr.endDate.slice(0, 16) })
    } catch (err: any) {
      showToast(err?.message ?? "Failed to load event", "error")
      router.replace("/admin/dashboard/events")
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!event) return
    setSaving(true)
    try {
      // No explicit update endpoint in services provided; left as no-op UI. Hook your update call here if/when added.
      showToast("Event updated (mock)", "success")
      router.replace("/admin/dashboard/events")
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

  if (!event) return null

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Event</h1>
          <p className="text-muted-foreground">Update the current event.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/dashboard/events">Back to Events</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" /> Event Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required disabled={saving} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Input id="year" type="number" value={form.year} onChange={(e) => setForm((p) => ({ ...p, year: Number(e.target.value) }))} required disabled={saving} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={4} required disabled={saving} />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="month">Month *</Label>
                <Input id="month" type="number" value={form.month} onChange={(e) => setForm((p) => ({ ...p, month: Number(e.target.value) }))} required disabled={saving} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start">Start *</Label>
                <Input id="start" type="datetime-local" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} required disabled={saving} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end">End *</Label>
                <Input id="end" type="datetime-local" value={form.endDate} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} required disabled={saving} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>{saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}</Button>
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

