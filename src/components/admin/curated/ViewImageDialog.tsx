"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getMediaUrl } from "@/utils/media"
import type { CuratedImage } from "@/types/curatedTypes"

interface ViewImageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  image: CuratedImage | null
}

function getCategoryName(image: CuratedImage): string {
  if (typeof image.category === "object" && image.category != null && "name" in image.category) {
    return (image.category as { name: string }).name
  }
  return ""
}

export function ViewImageDialog({ open, onOpenChange, image }: ViewImageDialogProps) {
  if (!image) return null

  const categoryName = getCategoryName(image)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[560px] max-h-[90vh] overflow-y-auto mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">View Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="aspect-[4/3] relative bg-muted rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getMediaUrl(image.image) || "/placeholder.svg"}
              alt={image.title}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="grid gap-3 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">Title</span>
              <p className="mt-0.5">{image.title}</p>
            </div>
            {categoryName && (
              <div>
                <span className="font-medium text-muted-foreground">Category</span>
                <p className="mt-0.5">{categoryName}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="font-medium text-muted-foreground">Order</span>
                <p className="mt-0.5">{image.order}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Display order</span>
                <p className="mt-0.5">{image.display_order ?? "—"}</p>
              </div>
            </div>
            {image.status && (
              <div>
                <span className="font-medium text-muted-foreground">Status</span>
                <p className="mt-0.5">{image.status}</p>
              </div>
            )}
            {image.jury_name && (
              <div>
                <span className="font-medium text-muted-foreground">Jury name</span>
                <p className="mt-0.5">{image.jury_name}</p>
              </div>
            )}
            {image.designation && (
              <div>
                <span className="font-medium text-muted-foreground">Designation</span>
                <p className="mt-0.5">{image.designation}</p>
              </div>
            )}
            {image.short_bio && (
              <div>
                <span className="font-medium text-muted-foreground">Short bio</span>
                <p className="mt-0.5 whitespace-pre-wrap">{image.short_bio}</p>
              </div>
            )}
            {image.full_biography && (
              <div>
                <span className="font-medium text-muted-foreground">Full biography</span>
                <div
                  className="mt-0.5 prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: image.full_biography }}
                />
              </div>
            )}
            {image.film_synopsis && (
              <div>
                <span className="font-medium text-muted-foreground">Film synopsis</span>
                <p className="mt-0.5 whitespace-pre-wrap">{image.film_synopsis}</p>
              </div>
            )}
            {(image.createdAt || image.updatedAt) && (
              <div className="grid grid-cols-2 gap-3 pt-2 border-t text-muted-foreground text-xs">
                {image.createdAt && (
                  <div>
                    <span className="font-medium">Created</span>
                    <p className="mt-0.5">{new Date(image.createdAt).toLocaleString()}</p>
                  </div>
                )}
                {image.updatedAt && (
                  <div>
                    <span className="font-medium">Updated</span>
                    <p className="mt-0.5">{new Date(image.updatedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
