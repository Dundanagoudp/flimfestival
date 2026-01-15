"use client"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import type { GalleryImage } from "@/types/galleryTypes"
import { getMediaUrl } from "@/utils/media"

type Props = {
  item: GalleryImage
  checked: boolean
  onCheckedChange: (id: string, checked: boolean) => void
  onImageClick: (image: GalleryImage) => void
}

export default function ImageCard({ item, checked, onCheckedChange, onImageClick }: Props) {
  const src = getMediaUrl(item.photo)
  
  const handleImageClick = () => {
    onImageClick(item)
  }
  
  return (
    <Card className="relative overflow-hidden h-36 sm:h-40 w-full bg-white border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer group">
      <div className="absolute left-1.5 top-1.5 sm:left-2 sm:top-2 z-10 rounded-full bg-white/90 p-2 sm:p-1.5 shadow-sm border border-gray-200">
        <Checkbox
          checked={checked}
          onCheckedChange={(v) => onCheckedChange(item._id, Boolean(v))}
          aria-label="Select image"
          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 h-4 w-4"
        />
      </div>
      
      <div className="h-full w-full" onClick={handleImageClick}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src || "/placeholder.svg?height=400&width=400&query=gallery%20image"}
          alt="Gallery image"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
      </div>
      
      {/* Click overlay hint */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 pointer-events-none" />
    </Card>
  )
}
