"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/custom-toast"
import { getCategories, getImagesByCategory } from "@/services/curatedService"
import type { CuratedCategory } from "@/types/curatedTypes"
import type { CuratedImage } from "@/types/curatedTypes"
import { Plus, Edit, Trash2, Images, Loader2, AlertCircle, Eye } from "lucide-react"
import { getMediaUrl } from "@/utils/media"
import { AddImageDialog } from "./AddImageDialog"
import { EditImageDialog } from "./EditImageDialog"
import { DeleteImageDialog } from "./DeleteImageDialog"
import { ViewImageDialog } from "./ViewImageDialog"

export default function CuratedImagesPage() {
  const { showToast } = useToast()
  const [categories, setCategories] = useState<CuratedCategory[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [images, setImages] = useState<CuratedImage[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingImages, setLoadingImages] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<CuratedImage | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoadingCategories(true)
    setError(null)
    getCategories()
      .then((data) => {
        if (!cancelled) {
          const list = Array.isArray(data) ? data : []
          setCategories(list)
          if (list.length > 0) {
            setSelectedCategoryId((prev) => prev || list[0]._id)
          }
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message || "Failed to load categories")
          showToast(err.message || "Failed to load categories", "error")
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingCategories(false)
      })
    return () => {
      cancelled = true
    }
  }, [showToast])

  useEffect(() => {
    if (!selectedCategoryId) {
      setImages([])
      return
    }
    let cancelled = false
    setLoadingImages(true)
    setError(null)
    getImagesByCategory(selectedCategoryId)
      .then((data) => {
        if (!cancelled) setImages(data.images ?? [])
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message || "Failed to load images")
          setImages([])
          showToast(err.message || "Failed to load images", "error")
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingImages(false)
      })
    return () => {
      cancelled = true
    }
  }, [selectedCategoryId, showToast])

  const refreshImages = () => {
    if (selectedCategoryId) {
      getImagesByCategory(selectedCategoryId)
        .then((data) => setImages(data.images ?? []))
        .catch((err: Error) => showToast(err.message || "Failed to refresh", "error"))
    }
  }

  const selectedCategory = selectedCategoryId ? categories.find((c) => c._id === selectedCategoryId) ?? null : null

  const handleAddSuccess = () => {
    setAddDialogOpen(false)
    refreshImages()
  }

  const handleEditSuccess = () => {
    setEditDialogOpen(false)
    setSelectedImage(null)
    refreshImages()
  }

  const handleDeleteSuccess = () => {
    setDeleteDialogOpen(false)
    setSelectedImage(null)
    refreshImages()
  }

  if (loadingCategories) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (error && !selectedCategoryId) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="flex items-center gap-3 p-6">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <div className="flex-1">
              <p className="font-medium text-destructive">Error</p>
              <p className="text-sm text-destructive/80">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-3 pt-0 sm:gap-6 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Curated Images</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage images by category
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={selectedCategoryId ?? ""}
            onValueChange={(v) => setSelectedCategoryId(v || null)}
            disabled={loadingCategories || categories.length === 0}
          >
            <SelectTrigger className="w-[200px] sm:w-[240px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c._id} value={c._id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => setAddDialogOpen(true)}
            disabled={!selectedCategoryId || categories.length === 0}
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Image
          </Button>
        </div>
      </div>

      {categories.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Images className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Create a category first from Curated Images → Categories.
            </p>
          </CardContent>
        </Card>
      )}

      {selectedCategoryId && categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base">
              {selectedCategory ? selectedCategory.name : "Images"}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {selectedCategory?.slug && <span className="mr-1">{selectedCategory.slug}</span>}
              {loadingImages ? " Loading…" : ` ${images.length} image(s).`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingImages ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-12">
                <Images className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No images in this category yet.</p>
                <Button onClick={() => setAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Image
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((img) => (
                  <div
                    key={img._id}
                    className="rounded-lg border bg-card overflow-hidden group"
                  >
                    <div className="aspect-[4/3] relative bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getMediaUrl(img.image) || "/placeholder.svg"}
                        alt={img.title || "Curated image"}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-2 space-y-1">
                      <p className="text-sm font-medium truncate" title={img.title}>
                        {img.title}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span>Order: {img.order}</span>
                        {img.status && <span>· {img.status}</span>}
                        {img.jury_name && <span className="truncate" title={img.jury_name}>· {img.jury_name}</span>}
                      </div>
                      <div className="flex gap-1 pt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 flex-1 min-w-0"
                          onClick={() => {
                            setSelectedImage(img)
                            setViewDialogOpen(true)
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 flex-1 min-w-0"
                          onClick={() => {
                            setSelectedImage(img)
                            setEditDialogOpen(true)
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8 flex-1 min-w-0"
                          onClick={() => {
                            setSelectedImage(img)
                            setDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <AddImageDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        categories={categories}
        onSuccess={handleAddSuccess}
      />
      <EditImageDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        image={selectedImage}
        categories={categories}
        currentCategoryId={selectedCategoryId}
        onSuccess={handleEditSuccess}
      />
      <DeleteImageDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        image={selectedImage}
        onSuccess={handleDeleteSuccess}
      />
      <ViewImageDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        image={selectedImage}
      />
    </div>
  )
}
