"use client"

import { useEffect, useState } from "react"
import { getGroupedImages } from "@/services/curatedService"
import type { CuratedGroupedItem, CuratedGroupedImage } from "@/types/curatedTypes"
import OfficialSectionCarousel from "./OfficialSectionCarousel"
import CuratedSectionShimmer from "./CuratedSectionShimmer"
import CuratedImageDetailModal from "./CuratedImageDetailModal"

export default function OfficialSection() {
  const [grouped, setGrouped] = useState<CuratedGroupedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<CuratedGroupedImage | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getGroupedImages()
      .then((data) => {
        if (!cancelled) setGrouped(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load")
          setGrouped([])
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return <CuratedSectionShimmer title="Official Selections" />
  }

  const officialItems = grouped.filter((item) => item.category.order === 2)
  if (error || officialItems.length === 0) {
    return null
  }

  return (
    <section className="w-full px-4 py-6 md:py-8 bg-white">
      <h2 className="text-center text-3xl md:text-4xl font-semibold text-primary tracking-tight mb-5 md:mb-6">
        <span className="border-b-2 border-accent pb-1">Official Selections</span>
      </h2>
      {officialItems.map((item) => {
        const { category, images } = item
        if (!images.length) return null

        return (
          <div key={category._id} className="mb-6 md:mb-8 last:mb-0">
            <OfficialSectionCarousel
              images={images}
              categoryName={category.name}
              onImageClick={(img) => {
                setSelectedImage(img)
                setDetailModalOpen(true)
              }}
            />
          </div>
        )
      })}
      <CuratedImageDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        image={selectedImage}
      />
    </section>
  )
}
