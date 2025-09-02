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
import { useToast } from "@/components/ui/custom-toast"
import { deleteCategory } from "@/services/blogsServices"
import { BlogCategory } from "@/types/blogsTypes"
import { Loader2, AlertTriangle } from "lucide-react"
import DynamicButton from "@/components/common/DynamicButton"

interface DeleteCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: BlogCategory | null
  onSuccess: () => void
}

export function DeleteCategoryDialog({ open, onOpenChange, category, onSuccess }: DeleteCategoryDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { showToast } = useToast()

  const handleDelete = async () => {
    if (!category) return

    setIsDeleting(true)
    try {
      await deleteCategory(category._id)
      showToast("Category deleted successfully!", "success")
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      showToast(error.message || "Failed to delete category", "error")
    } finally {
      setIsDeleting(false)
    }
  }

  if (!category) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Category
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the category "{category.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DynamicButton
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </DynamicButton>
          <DynamicButton
            type="button"
            variant="destructive"
            loading={isDeleting}
            loadingText="Deleting..."
            onClick={handleDelete}
          >
            Delete Category
          </DynamicButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
