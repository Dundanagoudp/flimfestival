"use client"

import * as React from "react"
import { X, Download } from "lucide-react"
import { DynamicButton } from "@/components/common"
import type { GalleryImage } from "@/types/galleryTypes"

type Props = {
  image: GalleryImage | null
  open: boolean
  onOpenChange: (open: boolean) => void
  yearValue?: number
}

export default function ImageModal({ image, open, onOpenChange, yearValue }: Props) {
  if (!open || !image) return null

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = image.photo
    link.download = `image-${image._id.slice(-6)}.jpg`
    link.click()
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl max-h-[90vh] overflow-auto">
        <div className="p-4 border-b flex items-center justify-between bg-gray-50">
          <h3 className="text-lg font-semibold">Image Details</h3>
          <DynamicButton 
            variant="outline" 
            size="sm" 
            onClick={(e) => onOpenChange(false)}
            className="hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </DynamicButton>
        </div>
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Image Display */}
            <div className="flex-1">
              <img
                src={image.photo}
                alt={`Gallery image ${image._id}`}
                className="w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
              />
            </div>
            
            {/* Image Info */}
            <div className="lg:w-80 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Image Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year:</span>
                    <span className="font-medium">{yearValue || 'Unknown'}</span>
                  </div>
                
                </div>
              </div>
              
              {/* Download Button */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-3">Download Image</h4>
                <DynamicButton 
                  onClick={(e) => handleDownload()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Image
                </DynamicButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
