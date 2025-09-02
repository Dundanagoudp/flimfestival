import React from 'react'
import { Button } from '@/components/ui/button'
function Guest() {
  return (
    <div>
         <main className="w-full px-4">
       <div className="px-10 py-10">
        <div className='flex justify-between items-center'>
            <h1 className='text-4xl font-bold'>Guest</h1>
            <div className="flex items-center gap-2">
                <Button className="rounded-full bg-primary text-black hover:bg-yellow-300">
                 View Schedule
                </Button>
                <span
                  aria-hidden
                  className="inline-block h-4 w-4 rounded-full bg-primary"
                />
              </div>
        </div>
        <div className="  px-4">
      <div className="grid grid-cols-3 gap-4">
        {/* Top-left: featured (larger) image with overlay */}
        <div className="relative">
          <img
            src="video.png"
            alt="Featured"
            className="w-full h-72 md:h-80 lg:h-96 rounded-lg object-cover border-2 border-gray-200 shadow-sm"
          />
          {/* gradient & text overlay */}
          <div className="absolute inset-0 rounded-lg pointer-events-none bg-gradient-to-t from-black/65 via-black/30 to-transparent"></div>
          <div className="absolute left-5 bottom-5 text-white pointer-events-none">
            <h3 className="text-2xl md:text-3xl font-semibold leading-tight">Judge</h3>
            <p className="text-sm md:text-base opacity-90 mt-1">13th November 2024</p>
          </div>
        </div>

        {/* Top row - right two thumbnails */}
        <img
          src="video.png"
          alt="Thumb 2"
          className="w-full h-72 md:h-80 lg:h-96 rounded-lg object-cover border-2 border-gray-200 shadow-sm"
        />
        <img
          src="video.png"
          alt="Thumb 3"
          className="w-full h-72 md:h-80 lg:h-96 rounded-lg object-cover border-2 border-gray-200 shadow-sm"
        />

        {/* Bottom row - 3 thumbnails (smaller height than top row) */}
        <img
          src="video.png"
          alt="Thumb 4"
          className="w-full h-60 md:h-56 rounded-lg object-cover border-2 border-gray-200 shadow-sm"
        />
        <img
          src="video.png"
          alt="Thumb 5"
          className="w-full h-60 md:h-56 rounded-lg object-cover border-2 border-gray-200 shadow-sm"
        />
        <img
          src="video.png"
          alt="Thumb 6"
          className="w-full h-60 md:h-56 rounded-lg object-cover border-2 border-gray-200 shadow-sm"
        />
      </div>
    </div>
       </div>
        </main>
    </div>
  )
}

export default Guest
