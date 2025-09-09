"use client"

import * as React from "react"
import useSWR, { mutate } from "swr"
import { Pencil, Trash2, Images, AlertCircle, Plus, Calendar, FileImage, Upload } from "lucide-react"
import { DynamicButton } from "@/components/common"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/custom-toast"
import { getAllYears, getAllGalleryByYear, deleteYear, bulkDeleteImages } from "@/services/galleryServices"
import type { GalleryImage, GalleryYear, GetAllGalleryResponse } from "@/types/galleryTypes"
import AddYearModal from "@/components/admin/gallery/modules/popups/addyearpopup"
import UpdateYearModal from "@/components/admin/gallery/modules/popups/updateyear"
import ConfirmDeleteModal from "@/components/admin/gallery/modules/popups/confirm-delete-modal"
import ImageModal from "@/components/admin/gallery/modules/popups/image-modal"
import ImageCard from "@/components/admin/gallery/modules/image-card"
import DynamicPagination from "@/components/common/DynamicPagination"

export default function GalleryPage() {
  const { showToast } = useToast()
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)
  const [selectedImage, setSelectedImage] = React.useState<GalleryImage | null>(null)
  const [showImageModal, setShowImageModal] = React.useState(false)
  
  const { data: years, isLoading: yearsLoading, error: yearsError } = useSWR<GalleryYear[]>(
    "years", 
    () => getAllYears(),
    {
      onError: (err) => {
        console.error("Error fetching years:", err)
        setError("Failed to load years")
      }
    }
  )
  
  const [selectedYearId, setSelectedYearId] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (years?.length && !selectedYearId) {
      setSelectedYearId(years[0]._id)
    }
  }, [years, selectedYearId])

  const { data: yearData, isLoading: imagesLoading, error: imagesError } = useSWR<GetAllGalleryResponse>(
    selectedYearId ? ["images", selectedYearId] : null,
    () => getAllGalleryByYear(selectedYearId as string),
    {
      onError: (err) => {
        console.error("Error fetching images:", err)
        setError("Failed to load images")
      }
    }
  )

  // Extract images from the year data
  const images = yearData?.images || []

  // Clear error when data loads successfully
  React.useEffect(() => {
    if (years && !yearsError) setError(null)
    if (yearData && !imagesError) setError(null)
  }, [years, yearsError, yearData, imagesError])

  // selection
  const [selected, setSelected] = React.useState<Set<string>>(new Set())
  React.useEffect(() => setSelected(new Set()), [selectedYearId])
  const toggleCheck = (id: string, v: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev)
      v ? next.add(id) : next.delete(id)
      return next
    })
  }
  const allChecked = images && images.length > 0 && selected.size === images.length
  const toggleAll = (v: boolean) => {
    if (!images) return
    setSelected(v ? new Set(images.map((i) => i._id)) : new Set())
    if (v && images.length > 0) {
      showToast(`Selected all ${images.length} images`, "info")
    } else if (!v) {
      showToast("Cleared all selections", "info")
    }
  }

  // pagination
  const [currentPage, setCurrentPage] = React.useState(1)
  const imagesPerPage = 20
  const totalPages = Math.ceil((images?.length || 0) / imagesPerPage)
  
  // Reset to first page when year changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [selectedYearId])
  
  // Get paginated images
  const paginatedImages = React.useMemo(() => {
    const startIndex = (currentPage - 1) * imagesPerPage
    const endIndex = startIndex + imagesPerPage
    return images.slice(startIndex, endIndex)
  }, [images, currentPage, imagesPerPage])

  // modals
  const [updateOpen, setUpdateOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const year = years?.find((y) => y._id === selectedYearId) ?? null

  const refreshYears = async () => {
    try {
      await mutate("years")
      setError(null)
      showToast("Years refreshed successfully", "success")
    } catch (err) {
      console.error("Error refreshing years:", err)
      setError("Failed to refresh years")
      showToast("Failed to refresh years", "error")
    }
  }
  
  const refreshImages = async () => {
    if (!selectedYearId) return
    try {
      await mutate(["images", selectedYearId])
      setError(null)
      showToast("Images refreshed successfully", "success")
    } catch (err) {
      console.error("Error fetching images:", err)
      setError("Failed to refresh images")
      showToast("Failed to refresh images", "error")
    }
  }

  const handleDeleteYear = async () => {
    if (!selectedYearId) return
    try {
      await deleteYear(selectedYearId)
      showToast("Year deleted successfully", "success")
      await refreshYears()
      setSelectedYearId(null)
      setError(null)
    } catch (e: any) {
      console.error("Error deleting year:", e)
      setError(e?.message || "Failed to delete year")
      showToast(e?.message || "Failed to delete year", "error")
    }
  }

  const handleBulkDelete = async () => {
    if (!selected.size) return
    try {
      await bulkDeleteImages(Array.from(selected))
      showToast(`Deleted ${selected.size} selected images`, "success")
      await refreshImages()
      setSelected(new Set())
      setError(null)
    } catch (e: any) {
      console.error("Error bulk deleting images:", e)
      setError(e?.message || "Failed to delete images")
      showToast(e?.message || "Failed to delete images", "error")
    }
  }

  const openImageModal = (image: GalleryImage) => {
    setSelectedImage(image)
    setShowImageModal(true)
  }

  const goToUploadPage = () => {
    router.push('/admin/gallery/add')
  }

  // Show error if there's one
  if (error) {
    return (
      <main className="container mx-auto max-w-10xl space-y-6 p-4">
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="flex items-center gap-3 p-6">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <div className="flex-1">
              <p className="font-medium text-destructive">Error</p>
              <p className="text-sm text-destructive/80">{error}</p>
            </div>
                         <DynamicButton variant="outline" onClick={(e) => window.location.reload()}>
               Retry
             </DynamicButton>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="container mx-auto max-w-10xl space-y-6 p-4">
      <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-pretty text-2xl font-semibold">Gallery</h1>
          <p className="text-muted-foreground">View, manage, and organize images by year.</p>
        </div>
        <div className="flex items-center gap-2">
                     <DynamicButton onClick={(e) => goToUploadPage()} className="flex items-center gap-2">
             <Upload className="mr-2 h-4 w-4" />
             Upload Images
           </DynamicButton>
          <AddYearModal onCreated={refreshYears} />
          {year ? (
            <>
                             <DynamicButton size="sm" variant="outline" onClick={(e) => setUpdateOpen(true)}>
                 <Pencil className="mr-2 h-4 w-4" /> Edit Year
               </DynamicButton>
               <DynamicButton size="sm" variant="destructive" onClick={(e) => setDeleteOpen(true)}>
                 <Trash2 className="mr-2 h-4 w-4" /> Delete Year
               </DynamicButton>
            </>
          ) : null}
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Total Years
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {yearsLoading ? "..." : years?.length ?? 0}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Images className="h-4 w-4" />
              Total Images
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {imagesLoading ? "..." : images?.length ?? 0}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <FileImage className="h-4 w-4" />
              Latest Year
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {yearsLoading ? "..." : years?.length ? Math.max(...years.map((y) => y.value)) : "-"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Checkbox className="h-4 w-4" />
              Selected
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{selected.size}</CardContent>
        </Card>
      </section>

      <section className="rounded-lg border p-4">
        <h2 className="mb-3 text-lg font-semibold">Filters & Controls</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="search">Search</Label>
            <Input id="search" placeholder="Search by year label..." />
          </div>
          <div className="grid gap-2">
            <Label>Year</Label>
            <Select value={selectedYearId ?? undefined} onValueChange={(v) => setSelectedYearId(v)}>
              <SelectTrigger>
                <SelectValue placeholder={yearsLoading ? "Loading..." : "Select year"} />
              </SelectTrigger>
              <SelectContent>
                {years?.map((y) => (
                  <SelectItem key={y._id} value={y._id}>
                    {y.value} {y.name ? `— ${y.name}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Checkbox checked={!!allChecked} onCheckedChange={(v) => toggleAll(Boolean(v))} id="select-all" />
            <Label htmlFor="select-all">Select All ({images?.length ?? 0})</Label>
            <Badge variant="secondary">{selected.size} selected</Badge>
          </div>
          <div className="flex items-center gap-2">
                         <DynamicButton variant="destructive" size="sm" disabled={!selected.size} onClick={(e) => handleBulkDelete()}>
               <Trash2 className="mr-2 h-4 w-4" /> Delete Selected
             </DynamicButton>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            {year ? `Year ${year.value}` : "No year selected"}{" "}
            {images ? (
              <span className="ml-2 align-middle text-sm text-muted-foreground">{images.length} images</span>
            ) : null}
          </h3>
          <div className="hidden sm:block">
            {year && (
                             <DynamicButton onClick={(e) => goToUploadPage()} variant="outline" size="sm">
                 <Plus className="mr-2 h-4 w-4" />
                 Add Images
               </DynamicButton>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {imagesLoading ? (
            Array.from({ length: 6 }).map((_, i) => <Card key={i} className="h-40 animate-pulse bg-muted/40" />)
          ) : paginatedImages && paginatedImages.length > 0 ? (
            paginatedImages.map((img) => (
              <ImageCard
                key={img._id}
                item={img}
                checked={selected.has(img._id)}
                onCheckedChange={toggleCheck}
                onImageClick={openImageModal}
              />
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="flex items-center gap-3 p-6 text-muted-foreground">
                <Images className="h-5 w-5" />
                <span>No images yet for this year. Use Upload Images to add images.</span>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <DynamicPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={images?.length ?? 0}
              itemsPerPage={imagesPerPage}
              maxVisiblePages={7}
            />
          </div>
        )}
      </section>

      <UpdateYearModal year={year} open={updateOpen} onOpenChange={setUpdateOpen} onUpdated={refreshYears} />
      <ConfirmDeleteModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteYear}
        title="Delete this year?"
        description="This will remove the year. Images may also be removed by your API. Proceed?"
      />
      
      {/* Image Modal */}
      <ImageModal
        image={selectedImage}
        open={showImageModal}
        onOpenChange={setShowImageModal}
        yearValue={year?.value}
      />
    </main>
  )
}
