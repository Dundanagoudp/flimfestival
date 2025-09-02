import React from 'react'
import { Button } from '@/components/ui/button'
export default function VideoSection() {
  return (
    <div style={{ backgroundColor: '#1A1A1A' }}>
       <main className="w-full px-4">
       <div className="px-10 py-10">
       <div className="grid grid-cols-1 lg:grid-cols-[30%_70%]  ">
          <div></div>

          {/* Right side About content */}
          <div className="flex flex-col justify-center">
            <section className="space-y-4">
              <h2 className="text-4xl font-bold text-[#FFFFFF]">About AFF</h2>
              <p className="text-3xl text-[#989898] leading-relaxed">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
                <br />
                Lorem Ipsum has been the industry's standard dummy text ever
                since the 1500s,
                <br />
                when an unknown printer took a galley of type and scrambled it
                to make a type specimen book.
              </p>
              {/* <div className="flex items-center gap-2">
                <Button className="rounded-full bg-primary text-black hover:bg-yellow-300">
                  Read More
                </Button>
                <span
                  aria-hidden
                  className="inline-block h-4 w-4 rounded-full bg-primary"
                />
              </div> */}
            </section>
        
          </div>
        
        </div>
        <section className='flex justify-center space-y-10 mt-10'>
              <img
                src="/video.png"
                alt="video"
                style={{
                  width: '1140px',
                  height: '539px',
                  borderRadius: '10px',
                  objectFit: 'cover'
                }}

              />
            </section>
       </div>
       </main>
    </div>
  )
}
