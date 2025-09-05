import React from 'react'
import ShowBlogs from '../module/ShowBlogs'
import Footer from '../../Home/footer/Footer'
import { Navbar } from '../../Home/navbar/Navbar'
import HeroSection from '../../Home/hero/Herosection'
import BlogHeroSection from '../module/BlogHeroSection'

export default function Blogs() {
  return (
    <div>
          
      <div className="-mt-[10rem]" style={{ backgroundColor: '#EEEEEE' }}>
        <BlogHeroSection/>
      <ShowBlogs/>
    </div>
    </div>
  )
}
