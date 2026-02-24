"use client"

export function VideoSkeleton() {
  return (
    <div className="flex flex-col space-y-3 animate-pulse">
      <div className="aspect-video rounded-xl bg-white/80" />
      <div className="flex space-x-3">
        <div className="w-9 h-9 rounded-full bg-white/80 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-full bg-white/80 rounded" />
          <div className="h-4 w-3/4 bg-white/80 rounded" />
          <div className="h-3 w-1/2 bg-white/80 rounded" />
        </div>
      </div>
    </div>
  )
}
