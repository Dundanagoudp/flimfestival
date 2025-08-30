"use client"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2 } from "lucide-react"
import type { GalleryImage } from "@/types/galleryTypes"

function toAbsoluteUrl(photo: string): string {
  if (/^https?:\/\//i.test(photo)) return photo
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || ""
  const origin = base.replace(/\/api\/?.*$/i, "")
  return `${origin}${photo.startsWith("/") ? "" : "/"}${photo}`
}

type Props = {
  item: GalleryImage
  checked: boolean
  onCheckedChange: (id: string, checked: boolean) => void
  onDelete: (id: string) => void
}

export default function ImageCard({ item, checked, onCheckedChange, onDelete }: Props) {
  const src = toAbsoluteUrl(item.photo)
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute left-2 top-2 z-10 rounded bg-background/80 p-1">
        <Checkbox
          checked={checked}
          onCheckedChange={(v) => onCheckedChange(item._id, Boolean(v))}
          aria-label="Select image"
        />
      </div>
      <button
        className="absolute right-2 top-2 z-10 rounded bg-background/80 p-1"
        onClick={() => onDelete(item._id)}
        aria-label="Delete image"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </button>
      <div className="aspect-square w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src || "/placeholder.svg?height=400&width=400&query=gallery%20image"}
          alt="Gallery image"
          className="h-full w-full object-cover"
        />
      </div>
    </Card>
  )
}
