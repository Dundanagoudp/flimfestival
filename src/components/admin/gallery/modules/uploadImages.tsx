"use client"

import * as React from "react"
import { addImages } from "@/services/galleryServices"
import { DynamicButton } from "@/components/common"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/custom-toast"
import { validateFile } from "@/lib/sanitize"

const GALLERY_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"]
const GALLERY_MAX_SIZE_MB = 5

type Props = {
  yearId: string
  dayId: string
  onDone?: () => void
}

export default function UploadImages({ yearId, dayId, onDone }: Props) {
  const { showToast } = useToast()
  const [files, setFiles] = React.useState<FileList | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const onUpload = async () => {
    if (!files?.length) {
      setError("Please select images first")
      return
    }
    if (!dayId) {
      setError("Day is required")
      return
    }
    for (const file of Array.from(files)) {
      const result = validateFile(file, GALLERY_ALLOWED_TYPES, GALLERY_MAX_SIZE_MB)
      if (!result.valid) {
        setError(result.error ?? "Invalid file")
        return
      }
    }

    try {
      setLoading(true)
      setError(null)
      await addImages(yearId, dayId, Array.from(files))
      showToast("Images uploaded successfully", "success")
      setFiles(null)
      onDone?.()
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
  }

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <div className="rounded-md bg-destructive/10 p-2 text-sm text-destructive">
          {error}
        </div>
      )}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input 
          type="file" 
          multiple 
          accept="image/*" 
          onChange={handleFileChange}
          className="w-full sm:max-w-xs"
        />
        <DynamicButton onClick={() => onUpload()} disabled={loading || !files?.length || !dayId} className="w-full sm:w-auto">
          {loading ? "Uploading..." : "Upload"}
        </DynamicButton>
      </div>
      {files && (
        <div className="text-xs text-muted-foreground">
          {files.length} file(s) selected
        </div>
      )}
    </div>
  )
}
