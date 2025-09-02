"use client"

import React from "react"
import { useState } from "react"
import { addGuest } from "@/services/guestService"
import type { Year } from "@/types/guestTypes"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/custom-toast"
import DynamicButton from "@/components/common/DynamicButton"
import { UserPlus, Upload, X, ImageIcon } from "lucide-react"

type Props = {
  open: boolean
  onClose: () => void
  years: Year[]
  onSuccess?: () => void
}

export default function AddGuestModal({ open, onClose, years, onSuccess }: Props) {
  const { showToast } = useToast()

  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [year, setYear] = useState<string>("")
  const [age, setAge] = useState<string>("")
  const [description, setDescription] = useState("")
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  // Reset form when modal opens
  React.useEffect(() => {
    if (open) {
      setName("")
      setRole("")
      setYear("")
      setAge("")
      setDescription("")
      setPhotoFile(null)
    }
  }, [open])

  const canSubmit = React.useMemo(() => {
    if (loading) return false
    const ageNum = Number(age)
    const requiredOk = name.trim() && role.trim() && year.trim() && !Number.isNaN(ageNum) && ageNum > 0
    return Boolean(requiredOk)
  }, [name, role, year, age, loading])

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return

    // Basic validations: type and size (<= 10MB)
    const isImage = f.type.startsWith("image/")
    const isLt10Mb = f.size <= 10 * 1024 * 1024
    if (!isImage) {
      showToast("Please select a valid image file", "error")
      return
    }
    if (!isLt10Mb) {
      showToast("Image must be 10MB or smaller", "error")
      return
    }

    setPhotoFile(f)
  }

  function removePhoto() {
    setPhotoFile(null)
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
        photo: photoFile || "",
      }

      await addGuest(payload)
      showToast("Guest added successfully", "success")

      onSuccess?.()
      onClose()
    } catch (e: any) {
      showToast(e?.message || "Failed to add guest", "error")
    } finally {
      setLoading(false)
    }
  }

  // Find the selected year object for display
  const selectedYear = years.find((y) => y._id === year)

  return (
    <Dialog open={open} onOpenChange={(o) => (!o ? onClose() : undefined)}>
      <DialogContent className="sm:max-w-xl w-[92vw] bg-background text-foreground border border-border rounded-xl p-6 max-h-[85vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/20">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-xl font-semibold text-foreground">Add New Guest</DialogTitle>
          <p className="text-sm text-muted-foreground">Fill in the details to add a new guest to the festival</p>
        </DialogHeader>

        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Name *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter guest name"
                className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              />
              <p className="text-xs text-muted-foreground">Enter the full name as it should appear.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                Role *
              </Label>
              <Input
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Enter guest role"
                className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              />
              <p className="text-xs text-muted-foreground">e.g., Director, Actor, Speaker.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year" className="text-sm font-medium text-gray-700">
                Year *
              </Label>
              <select
                id="year"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
                <p className="text-xs text-primary font-medium">
                  ✓ Selected: {selectedYear.value} {selectedYear.name && `(${selectedYear.name})`}
                </p>
              )}
              {!selectedYear && (
                <p className="text-xs text-muted-foreground">Choose the festival year for this guest.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-medium text-gray-700">
                Age *
              </Label>
              <Input
                id="age"
                type="number"
                min="1"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter age"
                className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                required
              />
              <p className="text-xs text-muted-foreground">Enter a positive number.</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter guest description (optional)"
              rows={3}
              className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Photo</Label>

            {!photoFile ? (
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-input border-dashed rounded-lg cursor-pointer bg-muted/40 hover:bg-muted/60 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={onPickFile} />
                </label>
              </div>
            ) : (
              <div className="relative space-y-3">
                <div className="flex items-center gap-3 p-3 bg-primary/10 border border-primary/30 rounded-lg">
                  <div className="w-12 h-12 bg-primary/15 rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src={URL.createObjectURL(photoFile)}
                      alt="Selected preview"
                      className="w-12 h-12 object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary truncate">{photoFile.name}</p>
                    <p className="text-xs text-primary/80">{(photoFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removePhoto}
                    className="text-primary hover:bg-primary/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
            className="text-foreground/80 hover:text-foreground"
          >
            Cancel
          </Button>
          <DynamicButton
            onClick={handleSubmit}
            disabled={!canSubmit}
            loading={loading}
            loadingText="Adding Guest..."
            variant="success"
            className="bg-primary hover:bg-primary/90 text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            Add Guest
          </DynamicButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
