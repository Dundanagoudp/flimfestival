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
import { deleteBlog } from "@/services/blogsServices"
import { BlogPost } from "@/types/blogsTypes"
import { Loader2, AlertTriangle, Trash2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import DynamicButton from "@/components/common/DynamicButton"

interface DeleteBlogDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  blog: BlogPost | null
  onSuccess: () => void
}

export function DeleteBlogDialog({ open, onOpenChange, blog, onSuccess }: DeleteBlogDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { showToast } = useToast()
  const { userRole } = useAuth()
  const canDelete = userRole === "admin"

  const handleDelete = async () => {
    if (!canDelete) return
    if (!blog) return

    setIsDeleting(true)
    try {
      await deleteBlog(blog._id)
      showToast("Blog deleted successfully!", "success")
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      showToast(error.message || "Failed to delete blog", "error")
    } finally {
      setIsDeleting(false)
    }
  }

  if (!blog) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Blog
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the blog "{blog.title}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
              {blog.imageUrl && (
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="space-y-1">
              <h4 className="font-medium">{blog.title}</h4>
              <p className="text-sm text-muted-foreground">
                {blog.contentType === "blog" ? "Blog Post" : "External Link"}
              </p>
              <p className="text-sm text-muted-foreground">
                Author: {blog.author}
              </p>
            </div>
          </div>
        </div>

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
            icon={<Trash2 className="mr-2 h-4 w-4" />}
            onClick={handleDelete}
            disabled={!canDelete}
          >
            Delete Blog
          </DynamicButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 