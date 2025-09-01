"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface BounceLoaderProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function BounceLoader({ size = "md", className }: BounceLoaderProps) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3", 
    lg: "w-4 h-4"
  }

  return (
    <div className={cn("flex space-x-1", className)}>
      <div
        className={cn(
          "bg-primary rounded-full animate-bounce",
          sizeClasses[size]
        )}
        style={{ animationDelay: "0ms" }}
      />
      <div
        className={cn(
          "bg-primary rounded-full animate-bounce",
          sizeClasses[size]
        )}
        style={{ animationDelay: "150ms" }}
      />
      <div
        className={cn(
          "bg-primary rounded-full animate-bounce",
          sizeClasses[size]
        )}
        style={{ animationDelay: "300ms" }}
      />
    </div>
  )
}
