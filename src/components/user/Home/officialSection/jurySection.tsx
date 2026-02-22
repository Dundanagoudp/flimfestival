"use client"

import { useEffect, useState } from "react"
import { getSectionBySlug } from "@/services/curatedService"
import type { CuratedGroupedImage, CuratedSectionResponse } from "@/types/curatedTypes"
import OfficialSectionCarousel from "./OfficialSectionCarousel"
import CuratedSectionShimmer from "./CuratedSectionShimmer"
import CuratedImageDetailModal from "./CuratedImageDetailModal"

export default function JurySection() {
  const [section, setSection] = useState<CuratedSectionResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<CuratedGroupedImage | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getSectionBySlug("jury")
      .then((data) => {
        if (!cancelled) setSection(data)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load")
          setSection(null)
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
    return <CuratedSectionShimmer title="Jury" />
  }

  if (error || !section) {
    return null
  }

  const { category, images } = section
  if (!images.length) {
    return null
  }

  return (
    <section className="w-full px-4 py-4 md:py-6 bg-white">
      <h2 className="text-center text-3xl md:text-4xl font-semibold text-primary tracking-tight mb-5 md:mb-6">
        <span className="border-b-2 border-accent pb-1">{category.name}</span>
      </h2>
      <div className="mb-6 md:mb-8 last:mb-0">
        <OfficialSectionCarousel
          images={images as CuratedGroupedImage[]}
          categoryName={category.name}
          onImageClick={(img) => {
            setSelectedImage(img)
            setDetailModalOpen(true)
          }}
        />
      </div>
      <CuratedImageDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        image={selectedImage}
      />
    </section>
  )
}
