"use client"

import { useEffect, useState } from "react"
import { getGroupedImages } from "@/services/curatedService"
import type { CuratedGroupedItem } from "@/types/curatedTypes"
import OfficialSectionCarousel from "./OfficialSectionCarousel"

export default function OfficialSection() {
  const [grouped, setGrouped] = useState<CuratedGroupedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
    return (
      <section className="w-full max-w-6xl mx-auto px-10 py-12">
        <div className="text-center text-muted-foreground">Loading…</div>
      </section>
    )
  }

  if (error || grouped.length === 0) {
    return null
  }

  return (
    <section className="w-full px-4 py-12 bg-white">
      <h2 className="text-center text-3xl md:text-4xl font-semibold text-primary tracking-tight mb-8">
        <span className="border-b-2 border-accent pb-1">Official Selections</span>
      </h2>
      {grouped.map((item) => {
        const { category, images } = item
        if (!images.length) return null

        return (
          <div key={category._id} className="mb-12 last:mb-0">
            <OfficialSectionCarousel
              images={images}
              categoryName={category.name}
            />
          </div>
        )
      })}
    </section>
  )
}
