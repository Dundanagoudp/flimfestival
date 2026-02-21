"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { deleteImage } from "@/services/curatedService"
import { useToast } from "@/components/ui/custom-toast"
import DynamicButton from "@/components/common/DynamicButton"
import { AlertTriangle, Trash2 } from "lucide-react"
import type { CuratedImage } from "@/types/curatedTypes"

interface DeleteImageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  image: CuratedImage | null
  onSuccess: () => void
}

export function DeleteImageDialog({ open, onOpenChange, image, onSuccess }: DeleteImageDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { showToast } = useToast()

  const handleDelete = async () => {
    if (!image) return
    setIsDeleting(true)
    try {
      await deleteImage(image._id)
      onSuccess()
      onOpenChange(false)
      showToast("Image deleted successfully!", "success")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete image"
      showToast(message, "error")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleClose = () => {
    if (!isDeleting) onOpenChange(false)
  }

  if (!image) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <DialogTitle className="text-lg sm:text-xl">Delete Image</DialogTitle>
          </div>
          <DialogDescription className="text-sm sm:text-base">
            Are you sure you want to delete this image{image.title ? ` "${image.title}"` : ""}? This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isDeleting} className="w-full sm:w-auto order-2 sm:order-1">
            Cancel
          </Button>
          <DynamicButton
            type="button"
            variant="destructive"
            onClick={handleDelete}
            loading={isDeleting}
            loadingText="Deleting..."
            disabled={isDeleting}
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DynamicButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
