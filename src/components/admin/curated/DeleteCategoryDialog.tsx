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
import { deleteCategory } from "@/services/curatedService"
import { useToast } from "@/components/ui/custom-toast"
import DynamicButton from "@/components/common/DynamicButton"
import { AlertTriangle, Trash2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import type { CuratedCategory } from "@/types/curatedTypes"

interface DeleteCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: CuratedCategory | null
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
      await deleteCategory(category._id)
      onSuccess()
    } catch (error: unknown) {
      const err = error as Error
      showToast(err.message || "Failed to delete category", "error")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleClose = () => {
    if (!isDeleting) onOpenChange(false)
  }

  if (!category) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <DialogTitle className="text-lg sm:text-xl">Delete Category</DialogTitle>
          </div>
          <DialogDescription className="text-sm sm:text-base">
            Are you sure you want to delete &quot;{category.name}&quot;? If this category has images, you must delete
            them first.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
            className="w-full sm:w-auto order-2 sm:order-1"
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
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Category
          </DynamicButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
