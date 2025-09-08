import HeroSection from '@/components/user/Home/hero/Herosection'
import ShowNotFound from './module/ShowNotFound'
import React from 'react'

export default function NotFound() {
  return (
    <div className="-mt-[10rem]" style={{ backgroundColor: '#EEEEEE' }}>
        <HeroSection/>
        <ShowNotFound/>
    </div>
  )
}
