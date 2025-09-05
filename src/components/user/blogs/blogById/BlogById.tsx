import React from 'react'
import ShowBlogs from '../module/ShowBlogs'
import BlogHeroSection from '../module/BlogHeroSection'
import ShowBlogById from '../module/ShowBlogById'

export default function BlogById() {
  return (
    <div>
      
      <div className="-mt-[10rem]" style={{ backgroundColor: '#EEEEEE' }}>
        <BlogHeroSection/>
      <ShowBlogById/>
     </div>
    </div>
  )
}
