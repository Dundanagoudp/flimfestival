"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Loader2, Save } from "lucide-react"
import { useToast } from "@/components/ui/custom-toast"
import { addEvent } from "@/services/eventsService"
import type { CreateEventPayload } from "@/types/eventsTypes"

function getNowISOString() {
  const now = new Date()
  const tzOffset = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - tzOffset).toISOString().slice(0, 16)
}

export default function CreateEventForm() {
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<CreateEventPayload & { startDate: string; endDate: string; imageFile?: File | null }>(
    {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      location: "",
      imageFile: null,
    },
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "year" || name === "month" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, imageFile: file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const payload: CreateEventPayload & { imageFile?: File | null } = {
        name: formData.name,
        description: formData.description,
        year: formData.year,
        month: formData.month,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        location: formData.location,
        imageFile: formData.imageFile || undefined,
      }
      await addEvent(payload)
      showToast("Event created successfully", "success")
      setFormData({ name: "", description: "", startDate: "", endDate: "", year: new Date().getFullYear(), month: new Date().getMonth() + 1, location: "", imageFile: null })
    } catch (err: any) {
      showToast(err?.message ?? "Failed to create event", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" /> Event Details
        </CardTitle>
        <CardDescription>Fill in the information for your new event.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Event Name *</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input id="year" name="year" type="number" value={formData.year} onChange={handleChange} min="2020" max="2030" required disabled={isLoading} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} required disabled={isLoading} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" value={formData.location || ""} onChange={handleChange} disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Event Image</Label>
              <Input id="image" name="image" type="file" accept="image/*" onChange={handleFileChange} disabled={isLoading} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="month">Month *</Label>
              <Input id="month" name="month" type="number" value={formData.month} onChange={handleChange} min="1" max="12" required disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input id="startDate" name="startDate" type="datetime-local" value={formData.startDate} onChange={handleChange} required disabled={isLoading} min={getNowISOString()} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input id="endDate" name="endDate" type="datetime-local" value={formData.endDate} onChange={handleChange} required disabled={isLoading} min={getNowISOString()} />
            </div>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</>) : (<><Save className="mr-2 h-4 w-4" /> Create Event</>)}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

