"use client"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { X } from "lucide-react"
import { getMediaUrl } from "@/utils/media"
import type { CuratedGroupedImage } from "@/types/curatedTypes"

interface CuratedImageDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  image: CuratedGroupedImage | null
}

function DetailLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </span>
  )
}

function DetailBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <DetailLabel>{label}</DetailLabel>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  )
}

export default function CuratedImageDetailModal({ open, onOpenChange, image }: CuratedImageDetailModalProps) {
  if (!image) return null

  const categoryName = image.category?.name

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="w-[95vw] max-w-[640px] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden mx-auto">
        <DialogTitle className="sr-only">
          {image.title ? `${image.title} – Details` : "Selection details"}
        </DialogTitle>
        {/* Image header - fixed height, no scroll */}
        <div className="relative aspect-[16/10] w-full bg-muted flex-shrink-0 overflow-hidden">
          <DialogClose
            className="absolute top-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </DialogClose>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getMediaUrl(image.image) || "/placeholder.svg"}
            alt={image.title || "Selection"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">
              {image.title || "—"}
            </h2>
            {categoryName && (
              <p className="text-sm text-white/90 mt-0.5">{categoryName}</p>
            )}
          </div>
        </div>

        {/* Scrollable details */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {image.jury_name && (
            <DetailBlock label="Jury">
              <p className="font-medium">{image.jury_name}</p>
              {image.designation && (
                <p className="text-muted-foreground mt-0.5">{image.designation}</p>
              )}
            </DetailBlock>
          )}

          {image.short_bio && (
            <DetailBlock label="Short bio">
              <p className="whitespace-pre-wrap leading-relaxed">{image.short_bio}</p>
            </DetailBlock>
          )}

          {image.full_biography && (
            <DetailBlock label="Full biography">
              <div
                className="prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: image.full_biography }}
              />
            </DetailBlock>
          )}

          {image.film_synopsis && (
            <DetailBlock label="Film synopsis">
              <p className="whitespace-pre-wrap leading-relaxed">{image.film_synopsis}</p>
            </DetailBlock>
          )}

          {(image.status || image.order != null) && (
            <div className="flex flex-wrap gap-4 pt-2 border-t">
              {image.status && (
                <div>
                  <DetailLabel>Status</DetailLabel>
                  <p className="text-sm mt-0.5">{image.status}</p>
                </div>
              )}
              {image.order != null && (
                <div>
                  <DetailLabel>Order</DetailLabel>
                  <p className="text-sm mt-0.5">{image.order}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
