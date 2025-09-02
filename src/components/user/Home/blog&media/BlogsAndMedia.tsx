import React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
export default function BlogsAndMedia() {
  return (
    <div >
       <main className="w-full px-4 "style={{ backgroundColor: "#ffffff" }} >
        <div className="px-10 py-10">
         <div className=" flex justify-between items-center">
            <div>
            <h1>Latest News</h1></div>
            <div>
                  <div className="flex items-center gap-2">
                <Button className="rounded-full bg-primary text-black hover:bg-yellow-300">
                  View All Post
                </Button>
                <span
                  aria-hidden
                  className="inline-block h-4 w-4 rounded-full bg-primary"
                />
              </div>
            </div>
         </div>
         <div className='flex justify-center items-center'>
          <h1 className='text-6xl font-black'>Blogs and Media</h1>
         </div>
         <div>
          <Card>
            
          </Card>
         </div>
        </div>
      </main>
    </div>
  )
}
