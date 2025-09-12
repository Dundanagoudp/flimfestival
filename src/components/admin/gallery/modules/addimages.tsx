"use client"

import * as React from "react"
import useSWR from "swr"
import { Upload, Images, AlertCircle, CheckCircle, Eye, Trash2, Plus, Calendar, FileImage, Download } from "lucide-react"
import { DynamicButton } from "@/components/common"
import DynamicPagination from "@/components/common/DynamicPagination"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { getAllYears, getAllGalleryByYear, deleteImage } from "@/services/galleryServices"
import { addImages } from "@/services/galleryServices"
import type { GalleryYear, GalleryImage } from "@/types/galleryTypes"
import { useToast } from "@/components/ui/custom-toast"
import { useAuth } from "@/context/auth-context"

export default function ImageUploadPage() {
  const { showToast } = useToast()
  const { userRole } = useAuth()
  const canDelete = userRole === "admin"
  const [selectedYearId, setSelectedYearId] = React.useState<string | null>(null)
  const [files, setFiles] = React.useState<FileList | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)
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

  const { data: yearData, isLoading: imagesLoading, error: imagesError } = useSWR(
    selectedYearId ? ["images", selectedYearId] : null,
    () => getAllGalleryByYear(selectedYearId as string),
    {
      onError: (err) => {
        console.error("Error fetching images:", err)
        setError("Failed to load images")
      }
    }
  )

  const images = yearData?.images || []

  // pagination
  const [currentPage, setCurrentPage] = React.useState(1)
  const imagesPerPage = 24
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

  React.useEffect(() => {
    if (years?.length && !selectedYearId) {
      setSelectedYearId(years[0]._id)
    }
  }, [years, selectedYearId])

  const selectedYear = years?.find((y) => y._id === selectedYearId)

  const onUpload = async () => {
    if (!selectedYearId) {
      setError("Please select a year first")
      return
    }
    
    if (!files?.length) {
      setError("Please select images first")
      return
    }
    
    // Validate file types
    const invalidFiles = Array.from(files).filter(file => !file.type.startsWith('image/'))
    if (invalidFiles.length > 0) {
      setError("Please select only image files")
      return
    }
    
    // Validate file sizes (max 5MB per file)
    const maxSize = 5 * 1024 * 1024 // 5MB
    const oversizedFiles = Array.from(files).filter(file => file.size > maxSize)
    if (oversizedFiles.length > 0) {
      setError("Some files are too large. Maximum size is 5MB per file")
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)
      await addImages(selectedYearId, Array.from(files))
      showToast(`Successfully uploaded ${files.length} image(s) to ${selectedYear?.value || 'selected year'}`, "success")
      setFiles(null)
      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement
      if (fileInput) fileInput.value = ''
      // Refresh images
      window.location.reload()
    } catch (e: any) {
      console.error("Error uploading images:", e)
      setError(e?.message || "Failed to upload images")
      showToast(e?.message || "Failed to upload images", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files)
    setError(null)
    setSuccess(null)
  }

  const clearMessages = () => {
    setError(null)
    setSuccess(null)
  }

  const handleDeleteImage = async (imageId: string) => {
    if (!canDelete) {
      showToast("You don't have permission to delete images", "error")
      return
    }
    try {
      await deleteImage(imageId)
      showToast("Image deleted successfully", "success")
      // Refresh images
      window.location.reload()
    } catch (e: any) {
      console.error("Error deleting image:", e)
      setError(e?.message || "Failed to delete image")
      showToast(e?.message || "Failed to delete image", "error")
    }
  }

  const openImageModal = (image: GalleryImage) => {
    setSelectedImage(image)
    setShowImageModal(true)
  }

  if (yearsError) {
    return (
      <main className="container mx-auto max-w-7xl space-y-6 p-4">
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="flex items-center gap-3 p-6">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <div className="flex-1">
              <p className="font-medium text-destructive">Error</p>
              <p className="text-sm text-destructive/80">Failed to load years</p>
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
    <main className="container mx-auto max-w-7xl space-y-6 p-4">
      <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-pretty text-2xl font-bold">Gallery Management</h1>
          <p className="text-muted-foreground">Upload, view, and manage images by year.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {selectedYear ? `Year ${selectedYear.value}` : 'No year selected'}
          </Badge>
        </div>
      </header>



      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Upload New Images
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Year Selection */}
          <div className="grid gap-2">
            <Label htmlFor="year-select">Select Year</Label>
            <Select value={selectedYearId ?? undefined} onValueChange={(v) => setSelectedYearId(v)}>
              <SelectTrigger id="year-select" className="max-w-xs">
                <SelectValue placeholder={yearsLoading ? "Loading years..." : "Select a year"} />
              </SelectTrigger>
              <SelectContent>
                {years?.map((y) => (
                  <SelectItem key={y._id} value={y._id}>
                    {y.value} {y.name ? `— ${y.name}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedYear && (
              <p className="text-sm text-muted-foreground">
                Selected: Year {selectedYear.value} {selectedYear.name ? `(${selectedYear.name})` : ''}
              </p>
            )}
          </div>

          <Separator />

          {/* File Upload */}
          <div className="grid gap-2">
            <Label htmlFor="file-input">Select Images</Label>
            <Input 
              id="file-input"
              type="file" 
              multiple 
              accept="image/*" 
              onChange={handleFileChange}
              className="max-w-xs"
            />
            <p className="text-xs text-muted-foreground">
              Supported formats: JPG, PNG, GIF, WebP. Maximum size: 5MB per file.
            </p>
          </div>

          {/* File Preview */}
          {files && files.length > 0 && (
            <div className="rounded-lg border p-4 bg-muted/20">
              <h4 className="mb-3 font-medium">Selected Files ({files.length})</h4>
              <div className="grid gap-2 md:grid-cols-3">
                {Array.from(files).map((file, index) => (
                  <div key={index} className="flex items-center gap-2 rounded border p-3 bg-background">
                    <Images className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              {success}
            </div>
          )}

          {/* Upload Button */}
          <div className="flex items-center gap-3">
            <DynamicButton 
              onClick={(e) => onUpload()} 
              disabled={!files?.length || !selectedYearId}
              loading={loading}
              loadingText="Uploading..."
              className="w-full sm:w-auto min-w-[140px]"
              size="lg"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Images
            </DynamicButton>
            
            {(error || success) && (
              <DynamicButton variant="outline" onClick={(e) => clearMessages()} className="w-full sm:w-auto">
                Clear
              </DynamicButton>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Images Display Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Images className="h-5 w-5" />
            Images in Year {selectedYear?.value || 'Unknown'}
            <Badge variant="outline">{images?.length || 0} images</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {imagesLoading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <Card key={i} className="h-32 animate-pulse bg-muted/40" />
              ))}
            </div>
          ) : paginatedImages && paginatedImages.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
              {paginatedImages.map((image) => (
                <div key={image._id} className="group relative">
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer">
                    <CardContent className="p-0">
                                             <img
                        src={image.photo}
                        alt={`Gallery image ${image._id}`}
                        className="w-full h-32 object-cover"
                        onClick={(e) => openImageModal(image)}
                      />
                      <div className="p-2">
                        <p className="text-xs text-muted-foreground truncate">
                          Image {image._id.slice(-6)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                    <DynamicButton
                      size="sm"
                      variant="secondary"
                                             onClick={(e) => openImageModal(image)}
                       className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </DynamicButton>
                    <DynamicButton
                      size="sm"
                      variant="destructive"
                                             onClick={(e) => handleDeleteImage(image._id)}
                       className="h-8 w-8 p-0"
                       disabled={!canDelete}
                    >
                      <Trash2 className="h-4 w-4" />
                    </DynamicButton>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Images className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No images yet</h3>
              <p className="text-sm text-muted-foreground">Upload some images to get started!</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <DynamicPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={images?.length || 0}
                itemsPerPage={imagesPerPage}
                maxVisiblePages={7}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Image Details</h3>
                             <DynamicButton variant="outline" size="sm" onClick={(e) => setShowImageModal(false)}>
                 Close
               </DynamicButton>
            </div>
            <div className="p-4">
                             <img
                src={selectedImage.photo}
                alt={`Gallery image ${selectedImage._id}`}
                className="w-full max-h-[60vh] object-contain rounded-lg"
              />
              <div className="mt-4 space-y-2">
                <p><strong>Year:</strong> {selectedYear?.value}</p>
                <div className="flex items-center gap-2">
                  <DynamicButton 
                                           onClick={(e) => {
                       const link = document.createElement('a')
                       link.href = selectedImage.photo
                       link.download = `image-${selectedImage._id.slice(-6)}.jpg`
                       link.click()
                     }}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Image
                  </DynamicButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
