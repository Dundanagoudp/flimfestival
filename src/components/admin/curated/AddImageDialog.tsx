"use client"

import { useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { uploadImage } from "@/services/curatedService"
import { useToast } from "@/components/ui/custom-toast"
import DynamicButton from "@/components/common/DynamicButton"
import type { CuratedCategory } from "@/types/curatedTypes"
import { validateFile } from "@/lib/sanitize"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]
const MAX_SIZE_MB = 5
const STATUS_OPTIONS = ["shows", "hidden"]

interface AddImageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: CuratedCategory[]
  onSuccess: () => void
}

export function AddImageDialog({ open, onOpenChange, categories, onSuccess }: AddImageDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [categoryId, setCategoryId] = useState("")
  const [title, setTitle] = useState("")
  const [order, setOrder] = useState(0)
  const [jury_name, setJuryName] = useState("")
  const [designation, setDesignation] = useState("")
  const [short_bio, setShortBio] = useState("")
  const [full_biography, setFullBiography] = useState("")
  const [film_synopsis, setFilmSynopsis] = useState("")
  const [display_order, setDisplayOrder] = useState(0)
  const [status, setStatus] = useState("shows")
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()

  const resetForm = () => {
    setFile(null)
    setCategoryId("")
    setTitle("")
    setOrder(0)
    setJuryName("")
    setDesignation("")
    setShortBio("")
    setFullBiography("")
    setFilmSynopsis("")
    setDisplayOrder(0)
    setStatus("shows")
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm()
      onOpenChange(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    setError(null)
    if (!f) {
      setFile(null)
      return
    }
    const result = validateFile(f, ALLOWED_TYPES, MAX_SIZE_MB)
    if (!result.valid) {
      setError(result.error ?? "Invalid file")
      setFile(null)
      return
    }
    setFile(f)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryId) {
      setError("Please select a category")
      return
    }
    if (!file) {
      setError("Please select an image file")
      return
    }
    if (!title.trim()) {
      setError("Title is required")
      return
    }
    setIsSubmitting(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("image", file)
      formData.append("category", categoryId)
      formData.append("title", title.trim())
      formData.append("order", String(order))
      if (jury_name.trim()) formData.append("jury_name", jury_name.trim())
      if (designation.trim()) formData.append("designation", designation.trim())
      if (short_bio.trim()) formData.append("short_bio", short_bio.trim())
      if (full_biography.trim()) formData.append("full_biography", full_biography.trim())
      if (film_synopsis.trim()) formData.append("film_synopsis", film_synopsis.trim())
      formData.append("display_order", String(display_order))
      formData.append("status", status)
      await uploadImage(formData)
      onSuccess()
      handleClose()
      showToast("Image uploaded successfully!", "success")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to upload image"
      setError(message)
      showToast(message, "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Add Image</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Upload an image to a curated category.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Category (required)</Label>
            <Select value={categoryId} onValueChange={setCategoryId} required disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c._id} value={c._id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Image file (required)</Label>
            <Input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_TYPES.join(",")}
              onChange={handleFileChange}
              disabled={isSubmitting}
            />
            {file && <p className="text-xs text-muted-foreground">{file.name}</p>}
          </div>
          <div className="space-y-2">
            <Label>Title (required)</Label>
            <Input
              placeholder="e.g. A Pale View of Hills"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Order</Label>
              <Input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value) || 0)}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label>Display order</Label>
              <Input
                type="number"
                value={display_order}
                onChange={(e) => setDisplayOrder(Number(e.target.value) || 0)}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Jury name (optional)</Label>
            <Input
              placeholder="e.g. Jane Doe"
              value={jury_name}
              onChange={(e) => setJuryName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label>Designation (optional)</Label>
            <Input
              placeholder="e.g. Film Director"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label>Short bio (optional)</Label>
            <Textarea
              placeholder="Short bio..."
              value={short_bio}
              onChange={(e) => setShortBio(e.target.value)}
              disabled={isSubmitting}
              rows={2}
              className="resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label>Full biography (optional, HTML allowed)</Label>
            <Textarea
              placeholder="Full biography..."
              value={full_biography}
              onChange={(e) => setFullBiography(e.target.value)}
              disabled={isSubmitting}
              rows={3}
              className="resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label>Film synopsis (optional)</Label>
            <Textarea
              placeholder="Film synopsis..."
              value={film_synopsis}
              onChange={(e) => setFilmSynopsis(e.target.value)}
              disabled={isSubmitting}
              rows={3}
              className="resize-none"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting} className="w-full sm:w-auto order-2 sm:order-1">
              Cancel
            </Button>
            <DynamicButton type="submit" loading={isSubmitting} loadingText="Uploading..." disabled={isSubmitting || !file || !categoryId || !title.trim()} className="w-full sm:w-auto order-1 sm:order-2">
              Upload
            </DynamicButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
