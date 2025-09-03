"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/custom-toast"
import { deleteTime } from "@/services/eventsService"
import type { TimeEntry } from "@/types/eventsTypes"

interface DeleteTimeSlotModalProps {
  isOpen: boolean
  onClose: () => void
  timeSlot: TimeEntry | null
  onSuccess: () => void
}

export default function DeleteTimeSlotModal({ isOpen, onClose, timeSlot, onSuccess }: DeleteTimeSlotModalProps) {
  const { showToast } = useToast()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!timeSlot) return

    setDeleting(true)
    try {
      await deleteTime(timeSlot._id)
      showToast("Time slot deleted successfully", "success")
      onSuccess()
      onClose()
    } catch (err: any) {
      showToast(err?.message ?? "Failed to delete time slot", "error")
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
            Delete Time Slot
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this time slot? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        {timeSlot && (
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium">{timeSlot.title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{timeSlot.description}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span>🕐 {timeSlot.startTime} - {timeSlot.endTime}</span>
              <span className="px-2 py-1 bg-secondary rounded text-xs">{timeSlot.type}</span>
            </div>
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
                Delete
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}