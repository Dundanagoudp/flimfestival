"use client"

import * as React from "react"
import { addImages } from "@/services/galleryServices"
import { DynamicButton } from "@/components/common"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/custom-toast"

type Props = {
  yearId: string
  onDone?: () => void
}

export default function UploadImages({ yearId, onDone }: Props) {
  const { showToast } = useToast()
  const [files, setFiles] = React.useState<FileList | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const onUpload = async () => {
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
      await addImages(yearId, Array.from(files))
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
        <DynamicButton onClick={(e) => onUpload()} disabled={loading || !files?.length} className="w-full sm:w-auto">
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
