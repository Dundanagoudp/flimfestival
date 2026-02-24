"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DynamicButton } from "@/components/common"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/custom-toast"
import { updateDay } from "@/services/galleryServices"
import type { GalleryDay } from "@/types/galleryTypes"

type Props = {
  day: GalleryDay | null
  open: boolean
  onOpenChange: (v: boolean) => void
  onUpdated?: () => void
}

export default function UpdateDayModal({ day, open, onOpenChange, onUpdated }: Props) {
  const { showToast } = useToast()
  const [error, setError] = React.useState<string | null>(null)
  const [name, setName] = React.useState(day?.name ?? "")
  const [date, setDate] = React.useState(day?.date ?? "")
  const [order, setOrder] = React.useState<number | "">(day?.order ?? "")
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    setName(day?.name ?? "")
    setDate(day?.date ?? "")
    setOrder(day?.order ?? "")
    setError(null)
  }, [day])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!day?._id) {
      setError("No day selected")
      return
    }

    if (!name.trim()) {
      setError("Please enter a day name")
      return
    }

    try {
      setLoading(true)
      await updateDay(day._id, {
        name: name.trim(),
        ...(date.trim() && { date: date.trim() }),
        ...(order !== "" && !Number.isNaN(Number(order)) && { order: Number(order) }),
      })
      showToast("Day updated successfully", "success")
      onOpenChange(false)
      setError(null)
      onUpdated?.()
    } catch (e: any) {
      console.error("Error updating day:", e)
      setError(e?.message || "Failed to update day")
      showToast(e?.message || "Failed to update day", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) setError(null)
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Day</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="day-name">Name</Label>
            <Input
              id="day-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Day 1, Opening Day"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="day-date">Date (optional)</Label>
            <Input
              id="day-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="day-order">Order (optional)</Label>
            <Input
              id="day-order"
              type="number"
              min={0}
              value={order}
              onChange={(e) => setOrder(e.target.value ? Number(e.target.value) : "")}
              placeholder="e.g., 1"
            />
          </div>
          <DialogFooter>
            <DynamicButton type="button" variant="secondary" onClick={() => handleOpenChange(false)}>
              Cancel
            </DynamicButton>
            <DynamicButton type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </DynamicButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
