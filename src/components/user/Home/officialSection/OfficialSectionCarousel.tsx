"use client"

import { useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getMediaUrl } from "@/utils/media"
import type { CuratedGroupedImage } from "@/types/curatedTypes"

interface OfficialSectionCarouselProps {
  images: CuratedGroupedImage[]
  categoryName?: string
  onImageClick?: (image: CuratedGroupedImage) => void
}

export default function OfficialSectionCarousel({ images, categoryName, onImageClick }: OfficialSectionCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  })

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  if (!images.length) return null

  return (
    <div className="relative px-10">
      <div className="overflow-hidden rounded-xl" ref={emblaRef}>
        <div className="flex gap-6">
          {images.map((item) => (
            <button
              key={item._id}
              type="button"
              onClick={() => onImageClick?.(item)}
              className="min-w-0 flex flex-col rounded-xl overflow-hidden flex-[0_0_100%] sm:flex-[0_0_calc((100%-24px)/2)] lg:flex-[0_0_calc((100%-72px)/4)] cursor-pointer shadow-md text-left hover:opacity-95 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <div className="flex-shrink-0 aspect-square w-full bg-muted overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getMediaUrl(item.image) || "/placeholder.svg"}
                  alt={item.title || "Selection"}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="w-full bg-black/80 px-3 py-2.5 flex-shrink-0">
                <h3 className="text-white text-sm font-medium leading-tight truncate">
                  {item.title || "—"}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-4 mb-4 sm:mt-5 sm:mb-5" aria-label={categoryName ? `Carousel navigation for ${categoryName}` : "Carousel navigation"}>
        <button
          type="button"
          onClick={scrollPrev}
          className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={scrollNext}
          className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
