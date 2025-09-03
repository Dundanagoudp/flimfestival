import React from 'react'
import { Navbar } from './navbar/Navbar'
import HeroSection from './hero/Herosection'
import AboutSection from './about/AboutSection'
import VideoSection from './videosection/VideoSection'
import EventSchedule from './eventSchedule/EventSchedule'
import Guest from './guest/Guest'
import AwardNomination from './award/AwardNomination'
import Gallery from './Gallery/Gallery'
import BlogsAndMedia from './blog&media/BlogsAndMedia'
import Footer from './footer/Footer'
import Contact from './contact/Contact'
import YearAward from './yearWiseAward/YearAward'

export default function Home() {
  return (
    <>
      <div className="sticky top-0 z-50 w-full">
        <Navbar />
      </div>
      <div className="-mt-[10rem]" style={{ backgroundColor: '#EEEEEE' }}>
        <HeroSection/>
        <AboutSection/>
        <VideoSection/>
        <EventSchedule/>
        <Guest/>
        <AwardNomination/>
        <Gallery/>
        <BlogsAndMedia/>
        <Contact/>
        <YearAward/>
        <Footer/>
      </div>
    </>
  )
}
