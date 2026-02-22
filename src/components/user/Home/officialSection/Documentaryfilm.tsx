"use client"

import { useEffect, useState } from "react"
import { getSectionBySlug } from "@/services/curatedService"
import type { CuratedGroupedImage, CuratedSectionResponse } from "@/types/curatedTypes"
import NominationSectionHeader from "./NominationSectionHeader"
import OfficialSectionCarousel from "./OfficialSectionCarousel"
import CuratedSectionShimmer from "./CuratedSectionShimmer"
import CuratedImageDetailModal from "./CuratedImageDetailModal"

export default function Documentaryfilm() {
  const [section, setSection] = useState<CuratedSectionResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<CuratedGroupedImage | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getSectionBySlug("documentary-film")
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
    return (
      <section className="w-full px-4 py-4 md:py-6 bg-white">
        <NominationSectionHeader title="Nomination for the best documentary film" />
        <CuratedSectionShimmer title="Documentary Film" />
      </section>
    )
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
      <NominationSectionHeader title="Nomination for the best documentary film" />
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
