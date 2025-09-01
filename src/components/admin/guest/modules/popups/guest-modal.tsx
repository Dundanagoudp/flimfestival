"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { addGuest, updateGuest } from "@/services/guestService"
import type { Guest, Year } from "@/types/guestTypes"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/custom-toast"
import DynamicButton from "@/components/common/DynamicButton"

type Props = {
  open: boolean
  onClose: () => void
  initial?: Partial<Guest> | null
  years: Year[]
  onSuccess?: () => void
}

export default function GuestModal({ open, onClose, initial, years, onSuccess }: Props) {
  const isEdit = Boolean(initial?._id)
  const { showToast } = useToast()

  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [year, setYear] = useState<string>("")
  const [age, setAge] = useState<string>("")
  const [description, setDescription] = useState("")
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string>("")
  const [loading, setLoading] = useState(false)

  // Reset form when modal opens/closes or initial changes
  useEffect(() => {
    if (open) {
      if (initial?._id) {
        // Editing mode - populate with existing data
        setName(initial.name || "")
        setRole(initial.role || "")
        
        // Handle year properly - if it's a number, find the corresponding year ID
        if (typeof initial.year === "number") {
          const yearObj = years.find(y => y.value === initial.year)
          setYear(yearObj?._id || "")
        } else {
          setYear(initial.year || "")
        }
        
        setAge(initial.age != null ? String(initial.age) : "")
        setDescription(initial.description || "")
        setPhotoFile(null)
        setPhotoUrl(typeof initial.photo === "string" ? initial.photo : "")
      } else {
        // Add mode - reset form
        setName("")
        setRole("")
        setYear("")
        setAge("")
        setDescription("")
        setPhotoFile(null)
        setPhotoUrl("")
      }
    }
  }, [initial, open, years])

  const canSubmit = useMemo(() => {
    if (loading) return false
    const ageNum = Number(age)
    const requiredOk = name.trim() && role.trim() && year.trim() && !Number.isNaN(ageNum) && ageNum > 0
    return Boolean(requiredOk)
  }, [name, role, year, age, loading])

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) {
      setPhotoFile(f)
      setPhotoUrl("")
    }
  }

  async function handleSubmit() {
    try {
      setLoading(true)
      
      // Validate required fields
      if (!name.trim() || !role.trim() || !year.trim() || !age.trim()) {
        showToast("Please fill in all required fields", "error")
        return
      }

      const ageNum = Number(age)
      if (Number.isNaN(ageNum) || ageNum <= 0) {
        showToast("Please enter a valid age", "error")
        return
      }

      const payload = {
        name: name.trim(),
        role: role.trim(),
        year: year.trim(),
        age: ageNum,
        description: description.trim(),
        photo: photoFile || photoUrl || "",
      }

      if (isEdit && initial?._id) {
        await updateGuest(initial._id, payload)
        showToast("Guest updated successfully", "success")
      } else {
        await addGuest(payload)
        showToast("Guest added successfully", "success")
      }
      
      onSuccess?.()
      onClose()
    } catch (e: any) {
      showToast(e?.message || "Failed to save guest", "error")
    } finally {
      setLoading(false)
    }
  }

  // Find the selected year object for display
  const selectedYear = years.find(y => y._id === year)

  return (
    <Dialog open={open} onOpenChange={(o) => (!o ? onClose() : undefined)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Update Guest" : "Add Guest"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name *</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter guest name"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role">Role *</Label>
            <Input 
              id="role" 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              placeholder="Enter guest role"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="year">Year *</Label>
            <select
              id="year"
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            >
              <option value="" disabled>
                Select year
              </option>
              {years.map((y) => (
                <option key={y._id} value={y._id}>
                  {y.name ? `${y.value} — ${y.name}` : String(y.value)}
                </option>
              ))}
            </select>
            {selectedYear && (
              <p className="text-xs text-muted-foreground">
                Selected: {selectedYear.value} {selectedYear.name && `(${selectedYear.name})`}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="age">Age *</Label>
            <Input 
              id="age" 
              type="number" 
              min="1" 
              max="120"
              value={age} 
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter age"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter guest description"
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="photo">Photo</Label>
            <Input 
              id="photo" 
              type="file" 
              accept="image/*" 
              onChange={onPickFile}
              placeholder="Select photo file"
            />
            {!photoFile && photoUrl ? (
              <div className="text-sm text-muted-foreground">
                <p>Current photo: {photoUrl}</p>
                <p className="text-xs">Upload a new file to replace it</p>
              </div>
            ) : photoFile ? (
              <p className="text-sm text-green-600">New photo selected: {photoFile.name}</p>
            ) : null}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <DynamicButton 
            onClick={handleSubmit} 
            disabled={!canSubmit}
            loading={loading}
            loadingText="Saving..."
            variant="success"
          >
            {isEdit ? "Update" : "Add"}
          </DynamicButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
