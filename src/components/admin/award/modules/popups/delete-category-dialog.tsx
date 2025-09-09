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
import { deleteAwardCategory } from "@/services/awardService"
import { AwardCategory } from "@/types/awardTypes"
import { useToast } from "@/components/ui/custom-toast"
import DynamicButton from "@/components/common/DynamicButton"
import { AlertTriangle, Trash2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"

interface DeleteCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: AwardCategory | null
  onSuccess: () => void
}

export function DeleteCategoryDialog({ open, onOpenChange, category, onSuccess }: DeleteCategoryDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { showToast } = useToast()
  const { userRole } = useAuth()
  const canDelete = userRole === "admin"

  const handleDelete = async () => {
    if (!canDelete) return
    if (!category) return
    
    setIsDeleting(true)
    try {
      await deleteAwardCategory(category._id)
      onSuccess()
    } catch (error: any) {
      showToast(error.message || "Failed to delete category", "error")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleClose = () => {
    if (!isDeleting) {
      onOpenChange(false)
    }
  }

  if (!category) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <DialogTitle>Delete Category</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete the category "{category.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">

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
            disabled={isDeleting || !canDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Category
          </DynamicButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
