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
import { deleteAward } from "@/services/awardService"
import { Award } from "@/types/awardTypes"
import { useToast } from "@/components/ui/custom-toast"
import DynamicButton from "@/components/common/DynamicButton"
import { AlertTriangle, Trash2, Trophy } from "lucide-react"

interface DeleteAwardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  award: Award | null
  onSuccess: () => void
}

export function DeleteAwardDialog({ open, onOpenChange, award, onSuccess }: DeleteAwardDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { showToast } = useToast()

  const handleDelete = async () => {
    if (!award) return
    
    setIsDeleting(true)
    try {
      await deleteAward(award._id)
      onSuccess()
    } catch (error: any) {
      showToast(error.message || "Failed to delete award", "error")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleClose = () => {
    if (!isDeleting) {
      onOpenChange(false)
    }
  }

  if (!award) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <DialogTitle>Delete Award</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete the award "{award.title}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-muted p-4 rounded-md space-y-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">{award.title}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <strong>Description:</strong>
                <p className="truncate">{award.description}</p>
              </div>
              <div>
                <strong>Category:</strong>
                <p>
                  {typeof award.category === 'string' 
                    ? award.category 
                    : award.category?.name || 'Unknown'
                  }
                </p>
              </div>
              <div>
                <strong>Rules:</strong>
                <p className="truncate">
                  {award.rule1}, {award.rule2}, {award.rule3}
                </p>
              </div>
              <div>
                <strong>Images:</strong>
                <p>{award.array_images?.length || 0} additional images</p>
              </div>
            </div>

            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                <strong>ID:</strong> {award._id}
              </p>
              {award.createdAt && (
                <p className="text-xs text-muted-foreground">
                  <strong>Created:</strong> {new Date(award.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <DynamicButton
            type="button"
            variant="destructive"
            onClick={handleDelete}
            loading={isDeleting}
            loadingText="Deleting..."
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Award
          </DynamicButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
