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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Edit Event
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Update the current event details</p>
          </div>
          <Button variant="outline" asChild className="w-full sm:w-auto border-slate-300 dark:border-slate-600">
            <Link href="/admin/dashboard/events">Back to Events</Link>
          </Button>
        </div>

        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Calendar className="h-5 w-5 text-orange-600" /> Event Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 dark:text-slate-300 font-medium">Name *</Label>
                  <Input 
                    id="name" 
                    value={form.name} 
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} 
                    required 
                    disabled={saving}
                    className="border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year" className="text-slate-700 dark:text-slate-300 font-medium">Year *</Label>
                  <Input 
                    id="year" 
                    type="number" 
                    value={form.year} 
                    onChange={(e) => setForm((p) => ({ ...p, year: Number(e.target.value) }))} 
                    required 
                    disabled={saving}
                    className="border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-700 dark:text-slate-300 font-medium">Description *</Label>
                <Textarea 
                  id="description" 
                  value={form.description} 
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} 
                  rows={4} 
                  required 
                  disabled={saving}
                  className="border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>
              
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="month" className="text-slate-700 dark:text-slate-300 font-medium">Month *</Label>
                  <Input 
                    id="month" 
                    type="number" 
                    value={form.month} 
                    onChange={(e) => setForm((p) => ({ ...p, month: Number(e.target.value) }))} 
                    required 
                    disabled={saving}
                    className="border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start" className="text-slate-700 dark:text-slate-300 font-medium">Start *</Label>
                  <Input 
                    id="start" 
                    type="datetime-local" 
                    value={form.startDate} 
                    onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} 
                    required 
                    disabled={saving}
                    className="border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end" className="text-slate-700 dark:text-slate-300 font-medium">End *</Label>
                  <Input 
                    id="end" 
                    type="datetime-local" 
                    value={form.endDate} 
                    onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} 
                    required 
                    disabled={saving}
                    className="border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                  />
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={saving}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Save Changes
                    </>
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

