"use client"

import { useState } from "react"
import Image from "next/image"
import { VideoCardProps } from "./video-card-types"

export function VideoCard({
  title,
  uploadTime,
  duration,
  thumbnailUrl,
  onClick,
}: VideoCardProps) {
  const [imgSrc, setImgSrc] = useState(thumbnailUrl || "/placeholder.svg")

  return (
    <div className="flex flex-col space-y-3 cursor-pointer group" onClick={onClick}>
      <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
        <Image
          src={imgSrc}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-200"
          onError={() => setImgSrc("/placeholder.svg")}
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="24" fill="black" fillOpacity="0.6" />
            <polygon points="20,16 34,24 20,32" fill="white" />
          </svg>
        </div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded">
          {duration}
        </div>
      </div>
      <div className="mt-2">
        <h3 className="font-medium text-sm sm:text-base line-clamp-2 text-gray-900 group-hover:text-gray-700">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          {uploadTime}
        </p>
      </div>
    </div>
  )
}
