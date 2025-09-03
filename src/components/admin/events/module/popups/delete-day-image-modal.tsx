"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2, Image as ImageIcon } from "lucide-react"
import { useToast } from "@/components/ui/custom-toast"
import { deleteEventDayImage } from "@/services/eventsService"
import type { EventDayItem } from "@/types/eventsTypes"

interface DeleteDayImageModalProps {
  isOpen: boolean
  onClose: () => void
  day: EventDayItem | null
  onSuccess: () => void
}

export default function DeleteDayImageModal({ isOpen, onClose, day, onSuccess }: DeleteDayImageModalProps) {
  const { showToast } = useToast()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!day) return

    setDeleting(true)
    try {
      await deleteEventDayImage(day._id)
      showToast("Day image deleted successfully", "success")
      onSuccess()
      onClose()
    } catch (err: any) {
      showToast(err?.message ?? "Failed to delete day image", "error")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-600" />
            Delete Day Image
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the image for this day? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        {day && (
          <div className="space-y-4">
            {/* Day Information */}
            <div className="p-3 bg-muted rounded-md text-sm">
              <p><strong>Day:</strong> {day.dayNumber}</p>
              <p><strong>Name:</strong> {day.name}</p>
              <p><strong>Description:</strong> {day.description}</p>
            </div>

            {/* Current Image Display */}
            {day.image && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Current Image:</p>
                <div className="relative w-full max-w-sm">
                  <img
                    src={day.image}
                    alt={`Day ${day.dayNumber} Image`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                    <ImageIcon className="h-3 w-3 inline mr-1" />
                    To Delete
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onClose} disabled={deleting}>
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Image
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}