"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DynamicButton } from "@/components/common"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/custom-toast"
import { createDay } from "@/services/galleryServices"

type Props = {
  yearId: string | null
  onCreated?: () => void
  trigger?: React.ReactNode
}

export default function AddDayModal({ yearId, onCreated, trigger }: Props) {
  const { showToast } = useToast()
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("")
  const [date, setDate] = React.useState("")
  const [order, setOrder] = React.useState<number | "">("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!yearId) {
      setError("Please select a year first")
      return
    }

    if (!name.trim()) {
      setError("Please enter a day name")
      return
    }

    try {
      setLoading(true)
      await createDay({
        yearId,
        name: name.trim(),
        ...(date.trim() && { date: date.trim() }),
        ...(order !== "" && !Number.isNaN(Number(order)) && { order: Number(order) }),
      })
      showToast("Day created successfully", "success")
      setOpen(false)
      setName("")
      setDate("")
      setOrder("")
      setError(null)
      onCreated?.()
    } catch (e: any) {
      console.error("Error creating day:", e)
      setError(e?.message || "Failed to create day")
      showToast(e?.message || "Failed to create day", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setError(null)
      setName("")
      setDate("")
      setOrder("")
    }
    setOpen(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <DynamicButton size="sm" disabled={!yearId}>Add Day</DynamicButton>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Day</DialogTitle>
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
            <DynamicButton type="submit" disabled={loading || !yearId}>
              {loading ? "Creating..." : "Create"}
            </DynamicButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
