"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { updateGuest } from "@/services/guestService"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/custom-toast"
import DynamicButton from "@/components/common/DynamicButton"
import { User, Upload, X, ImageIcon } from "lucide-react"

type Year = {
  _id: string
  value: number
  name?: string
}

type Guest = {
  _id: string
  name: string
  role: string
  year: number | string
  age?: number
  description?: string
  photo?: string | File
}

type Props = {
  open: boolean
  onClose: () => void
  guest: Guest | null
  years: Year[]
  onSuccess?: () => void
}

export default function EditGuestModal({ open, onClose, guest, years, onSuccess }: Props) {
  const { showToast } = useToast()

  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [year, setYear] = useState<string>("")
  const [age, setAge] = useState<string>("")
  const [description, setDescription] = useState("")
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string>("")
  const [loading, setLoading] = useState(false)

  // Populate form when guest data changes
  useEffect(() => {
    if (open && guest) {
      setName(guest.name || "")
      setRole(guest.role || "")

      // Handle year properly - if it's a number, find the corresponding year ID
      if (typeof guest.year === "number") {
        const yearObj = years.find((y) => y.value === guest.year)
        setYear(yearObj?._id || "")
      } else {
        setYear(guest.year || "")
      }

      setAge(guest.age != null ? String(guest.age) : "")
      setDescription(guest.description || "")
      setPhotoFile(null)
      setPhotoUrl(typeof guest.photo === "string" ? guest.photo : "")
    }
  }, [guest, open, years])

  const canSubmit = useMemo(() => {
    if (loading || !guest) return false
    const ageNum = Number(age)
    const requiredOk = name.trim() && role.trim() && year.trim() && !Number.isNaN(ageNum) && ageNum > 0
    return Boolean(requiredOk)
  }, [name, role, year, age, loading, guest])

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return

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
    if (!guest) return

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

      await updateGuest(guest._id, payload)
      showToast("Guest updated successfully", "success")

      onSuccess?.()
      onClose()
    } catch (e: any) {
      showToast(e?.message || "Failed to update guest", "error")
    } finally {
      setLoading(false)
    }
  }

  // Find the selected year object for display
  const selectedYear = years.find((y) => y._id === year)

  if (!guest) return null

  return (
    <Dialog open={open} onOpenChange={(o) => (!o ? onClose() : undefined)}>
      <DialogContent className="sm:max-w-[425px] w-[92vw] bg-background text-foreground border border-border rounded-xl p-6 max-h-[85vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-primary/15 ring-1 ring-primary/20">
            <User className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-xl font-semibold text-foreground">Update Guest</DialogTitle>
          <p className="text-sm text-muted-foreground">Modify the guest information below</p>
        </DialogHeader>

        <div className="space-y-6">

          {/* Name */}
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
              required
            />
            <p className="text-xs text-muted-foreground">Enter the full name as it should appear.</p>
          </div>

          {/* Role */}
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
              required
            />
            <p className="text-xs text-muted-foreground">e.g., Director, Actor, Speaker.</p>
          </div>

          {/* Year */}
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
            {selectedYear ? (
              <p className="text-xs text-primary font-medium">
                ✓ Selected: {selectedYear.value} {selectedYear.name && `(${selectedYear.name})`}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">Choose the festival year for this guest.</p>
            )}
          </div>

          {/* Age */}
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

          {/* Description */}
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

          {/* Photo */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Photo</Label>

            {!photoFile && photoUrl ? (
              // Show current photo
              <div className="space-y-3">
                <div className="grid grid-cols-[48px_1fr] items-center gap-3 p-3 rounded-lg border border-input bg-muted/40">
                  <div className="w-12 h-12 rounded-lg bg-primary/15 grid place-items-center overflow-hidden">
                    {photoUrl ? (
                      <img
                        src={photoUrl || "/placeholder.svg"}
                        alt="Current photo"
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">Current photo</p>
                    {/* <p className="text-xs text-muted-foreground truncate">{photoUrl}</p> */}
                  </div>
                </div>

                <div className="grid place-items-center w-full">
                  <label className="grid place-items-center w-full h-24 border-2 border-input border-dashed rounded-lg cursor-pointer bg-muted/40 hover:bg-muted/60 transition-colors">
                    <div className="grid place-items-center gap-2 pt-3 pb-4">
                      <Upload className="w-6 h-6 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">Click to upload</span> new photo
                      </p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={onPickFile} />
                  </label>
                </div>
              </div>
            ) : photoFile ? (
              // Show new selected photo
              <div className="grid">
                <div className="grid grid-cols-[48px_1fr_auto] items-center gap-3 p-3 bg-primary/10 border border-primary/30 rounded-lg">
                  <div className="w-12 h-12 bg-primary/15 rounded-lg grid place-items-center overflow-hidden">
                    <img
                      src={URL.createObjectURL(photoFile) || "/placeholder.svg"}
                      alt="Selected preview"
                      className="w-12 h-12 object-cover rounded"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-primary truncate">{photoFile.name}</p>
                    <p className="text-xs text-primary/80">{(photoFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removePhoto}
                    className="text-primary hover:bg-primary/10"
                    aria-label="Remove selected photo"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              // No photo - show upload area
              <div className="grid place-items-center w-full">
                <label className="grid place-items-center w-full h-32 border-2 border-input border-dashed rounded-lg cursor-pointer bg-muted/40 hover:bg-muted/60 transition-colors">
                  <div className="grid place-items-center gap-2 pt-5 pb-6">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={onPickFile} />
                </label>
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
            loadingText="Updating Guest..."
            variant="success"
            className="bg-primary hover:bg-primary/90 text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            Update Guest
          </DynamicButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
