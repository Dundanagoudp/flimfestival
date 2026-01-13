"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, Image as ImageIcon, X } from "lucide-react"
import { useToast } from "@/components/ui/custom-toast"
import { updateEventDayWithImage } from "@/services/eventsService"
import type { EventDayItem } from "@/types/eventsTypes"
import { getMediaUrl } from "@/utils/media"

interface UpdateDayImageModalProps {
  isOpen: boolean
  onClose: () => void
  day: EventDayItem | null
  onSuccess: () => void
}

export default function UpdateDayImageModal({ isOpen, onClose, day, onSuccess }: UpdateDayImageModalProps) {
  const { showToast } = useToast()
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }
  const getImageSrc = (url: string) => {
    return getMediaUrl(url)
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!day || !selectedFile) return

    setUploading(true)
    try {
      await updateEventDayWithImage(day._id, selectedFile)
      showToast("Day image updated successfully", "success")
      onSuccess()
      onClose()
      // Clean up preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    } catch (err: any) {
      showToast(err?.message ?? "Failed to update day image", "error")
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    // Clean up preview URL when closing
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setSelectedFile(null)
    setPreviewUrl(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Update Day Image
          </DialogTitle>
          <DialogDescription>
            {day && `Update the image for Day ${day.dayNumber}: ${day.name}`}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Image Display */}
          {day?.image && (
            <div className="space-y-2">
              <Label>Current Image</Label>
              <div className="relative w-full max-w-md">
                <img
                  src={getImageSrc(day.image)}
                  alt={`Current Day ${day.dayNumber} Image`}
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  Current
                </div>
              </div>
            </div>
          )}

          {/* File Selection */}
          <div className="space-y-2">
            <Label htmlFor="image">Select New Image *</Label>
            <div className="relative">
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploading}
              />
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to select an image file
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, JPEG up to 10MB
                </p>
              </div>
            </div>
          </div>

          {/* Preview New Image */}
          {previewUrl && (
            <div className="space-y-2">
              <Label>Preview New Image</Label>
              <div className="relative w-full max-w-md">
                <img
                  src={previewUrl}
                  alt="Preview of new image"
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                  New
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 left-2"
                  onClick={() => {
                    setSelectedFile(null)
                    URL.revokeObjectURL(previewUrl)
                    setPreviewUrl(null)
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          {/* Day Info */}
          {day && (
            <div className="p-3 bg-muted rounded-md text-sm">
              <p><strong>Day:</strong> {day.dayNumber}</p>
              <p><strong>Name:</strong> {day.name}</p>
              <p><strong>Description:</strong> {day.description}</p>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={handleClose} disabled={uploading}>
              Cancel
            </Button>
            <Button type="submit" disabled={uploading || !selectedFile}>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Update Image
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}