"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DynamicButton } from "@/components/common"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { useToast } from "@/components/ui/use-toast"
import { createYear } from "@/services/galleryServices"

type Props = {
  onCreated?: () => void
  trigger?: React.ReactNode
}

export default function AddYearModal({ onCreated, trigger }: Props) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<number | "">("")
  const [name, setName] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
//   const { toast } = useToast()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
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
      await createYear({ value: Number(value), name: name.trim() })
    //   toast({ title: "Year created" })
      setOpen(false)
      setValue("")
      setName("")
      setError(null)
      onCreated?.()
    } catch (e: any) {
      console.error("Error creating year:", e)
      setError(e?.message || "Failed to create year")
    //   toast({
    //     title: "Failed to create",
    //     description: e?.response?.data?.message ?? e?.message,
    //     variant: "destructive",
    //   })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setError(null)
      setValue("")
      setName("")
    }
    setOpen(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <DynamicButton size="sm">Add Year</DynamicButton>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Year</DialogTitle>
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
            <DynamicButton type="button" variant="secondary" onClick={() => handleOpenChange(false)}>
              Cancel
            </DynamicButton>
            <DynamicButton type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </DynamicButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
