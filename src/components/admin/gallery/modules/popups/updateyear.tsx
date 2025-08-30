"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DynamicButton } from "@/components/common"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/custom-toast"
import { updateYear } from "@/services/galleryServices"
import type { GalleryYear } from "@/types/galleryTypes"

type Props = {
  year: GalleryYear | null
  open: boolean
  onOpenChange: (v: boolean) => void
  onUpdated?: () => void
}

export default function UpdateYearModal({ year, open, onOpenChange, onUpdated }: Props) {
  const { showToast } = useToast()
  const [error, setError] = React.useState<string | null>(null)
  const [value, setValue] = React.useState<number | "">(year?.value ?? "")
  const [name, setName] = React.useState<string>(year?.name ?? "")
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    setValue(year?.value ?? "")
    setName(year?.name ?? "")
    setError(null)
  }, [year])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!year?._id) {
      setError("No year selected")
      return
    }
    
    if (!value || !name.trim()) {
      setError("Please enter both year and label")
      return
    }
    
    if (Number(value) < 1900 || Number(value) > 2100) {
      setError("Please enter a valid year between 1900 and 2100")
      return
    }
    
    try {
      setLoading(true)
      await updateYear(year._id, { value: Number(value), name: name.trim() })
      showToast("Year updated successfully", "success")
      onOpenChange(false)
      setError(null)
      onUpdated?.()
    } catch (e: any) {
      console.error("Error updating year:", e)
      setError(e?.message || "Failed to update year")
      showToast(e?.message || "Failed to update year", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setError(null)
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Year</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value ? Number(e.target.value) : "")}
              placeholder="e.g., 2024"
              min="1900"
              max="2100"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="label">Label</Label>
            <Input 
              id="label" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g., Festival 2024"
              required 
            />
          </div>
          <DialogFooter>
                         <DynamicButton type="button" variant="secondary" onClick={(e) => handleOpenChange(false)}>
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
