"use client"

import { useEffect, useState } from "react"
import { getSectionBySlug } from "@/services/curatedService"
import type { CuratedGroupedImage, CuratedSectionResponse } from "@/types/curatedTypes"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import OfficialSectionCarousel from "@/components/user/Home/officialSection/OfficialSectionCarousel"
import CuratedSectionShimmer from "@/components/user/Home/officialSection/CuratedSectionShimmer"
import CuratedImageDetailModal from "@/components/user/Home/officialSection/CuratedImageDetailModal"
import NominationSectionHeader from "@/components/user/Home/officialSection/NominationSectionHeader"

type TabSlug = "short-film" | "documentary-film"

function FilmTabPanel({
  slug,
  title,
  onImageClick,
}: {
  slug: TabSlug
  title: string
  onImageClick: (img: CuratedGroupedImage) => void
}) {
  const [section, setSection] = useState<CuratedSectionResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getSectionBySlug(slug)
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
  }, [slug])

  if (loading) {
    return (
      <div className="w-full px-4 py-6 md:py-8 bg-white">
        <NominationSectionHeader title={title} showViewAward={false} />
        <CuratedSectionShimmer title={title} />
      </div>
    )
  }

  if (error || !section) {
    return (
      <div className="w-full px-4 py-8 bg-white text-center text-muted-foreground">
        {error ?? "Failed to load section."}
      </div>
    )
  }

  const { category, images } = section
  if (!images.length) {
    return (
      <div className="w-full px-4 py-8 bg-white">
        <NominationSectionHeader title={title} showViewAward={false} />
        <p className="text-center text-muted-foreground py-8">No items in this section yet.</p>
      </div>
    )
  }

  return (
    <div className="w-full px-4 py-6 md:py-8 bg-white">
      <NominationSectionHeader title={title} showViewAward={false} />
      <div className="mb-6 md:mb-8 last:mb-0">
        <OfficialSectionCarousel
          images={images as CuratedGroupedImage[]}
          categoryName={category.name}
          onImageClick={onImageClick}
        />
      </div>
    </div>
  )
}

export default function FilmsPageContent() {
  const [selectedImage, setSelectedImage] = useState<CuratedGroupedImage | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)

  return (
    <>
      <Tabs defaultValue="short-film" className="w-full">
        <div className="w-full px-4 sm:px-6 pt-6 pb-2 bg-white border-b">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="short-film">Short Film</TabsTrigger>
            <TabsTrigger value="documentary-film">Documentary Film</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="short-film" className="mt-0">
          <FilmTabPanel
            slug="short-film"
            title="Nomination for the best short film"
            onImageClick={(img) => {
              setSelectedImage(img)
              setDetailModalOpen(true)
            }}
          />
        </TabsContent>
        <TabsContent value="documentary-film" className="mt-0">
          <FilmTabPanel
            slug="documentary-film"
            title="Nomination for the best documentary film"
            onImageClick={(img) => {
              setSelectedImage(img)
              setDetailModalOpen(true)
            }}
          />
        </TabsContent>
      </Tabs>
      <CuratedImageDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        image={selectedImage}
      />
    </>
  )
}
