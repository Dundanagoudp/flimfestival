"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { SessionPlanCategory } from "@/types/sessionPlanTypes"
import type { SessionPlanSlot } from "@/types/sessionPlanTypes"
import { Loader2 } from "lucide-react"

export interface SlotFormValues {
  title: string
  startTime: string
  endTime: string
  director: string
  moderator: string
  duration: string
  category: string
  description: string
  order: string
}

const defaultValues: SlotFormValues = {
  title: "",
  startTime: "",
  endTime: "",
  director: "",
  moderator: "",
  duration: "",
  category: "",
  description: "",
  order: "",
}

interface SlotFormProps {
  categories: SessionPlanCategory[]
  initial?: SessionPlanSlot | null
  onSubmit: (values: SlotFormValues) => Promise<void>
  onCancel: () => void
  submitLabel?: string
}

function categoryIdOrName(c: SessionPlanCategory) {
  return c.id ?? c._id
}

export function SlotForm({
  categories,
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Add Slot",
}: SlotFormProps) {
  const [form, setForm] = useState<SlotFormValues>(defaultValues)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (initial) {
      const cat = initial.category
      const catValue =
        typeof cat === "string"
          ? cat
          : (cat && (cat as any).name) || (cat && (cat as any).id) || (cat && (cat as any)._id)
          ? String((cat as any).name ?? (cat as any).id ?? (cat as any)._id)
          : ""
      setForm({
        title: initial.title ?? "",
        startTime: initial.startTime ?? "",
        endTime: initial.endTime ?? "",
        director: initial.director ?? "",
        moderator: initial.moderator ?? "",
        duration: initial.duration ?? "",
        category: catValue,
        description: initial.description ?? "",
        order: initial.order != null ? String(initial.order) : "",
      })
    } else {
      setForm(defaultValues)
    }
  }, [initial])

  const set = (k: keyof SlotFormValues, v: string) => {
    setForm((prev) => ({ ...prev, [k]: v }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    if (!form.startTime.trim()) return
    setSubmitting(true)
    try {
      await onSubmit(form)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="slot-title">Title *</Label>
        <Input
          id="slot-title"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Film / Event title"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="slot-start">Start time *</Label>
          <Input
            id="slot-start"
            value={form.startTime}
            onChange={(e) => set("startTime", e.target.value)}
            placeholder="10:30 AM"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="slot-end">End time</Label>
          <Input
            id="slot-end"
            value={form.endTime}
            onChange={(e) => set("endTime", e.target.value)}
            placeholder="12:00 PM"
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="slot-director">Director / Presenter</Label>
        <Input
          id="slot-director"
          value={form.director}
          onChange={(e) => set("director", e.target.value)}
          placeholder="Name"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="slot-moderator">Moderator</Label>
        <Input
          id="slot-moderator"
          value={form.moderator}
          onChange={(e) => set("moderator", e.target.value)}
          placeholder="For workshops & panels"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="slot-duration">Duration</Label>
        <Input
          id="slot-duration"
          value={form.duration}
          onChange={(e) => set("duration", e.target.value)}
          placeholder="1hr 30m"
        />
      </div>
      <div className="grid gap-2">
        <Label>Category</Label>
        <Select
          value={form.category || undefined}
          onValueChange={(v) => set("category", v || "")}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={categoryIdOrName(c)} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
            {form.category && !categories.some((c) => c.name === form.category) && (
              <SelectItem value={form.category}>{form.category}</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="slot-description">Description / Notes</Label>
        <textarea
          id="slot-description"
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Additional details..."
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="slot-order">Order (optional)</Label>
        <Input
          id="slot-order"
          type="number"
          value={form.order}
          onChange={(e) => set("order", e.target.value)}
          placeholder="0"
        />
      </div>
      <div className="flex gap-2 pt-2 border-t">
        <Button type="submit" disabled={submitting}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
