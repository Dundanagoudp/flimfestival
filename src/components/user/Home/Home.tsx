import React from 'react'
import { Navbar } from './navbar/Navbar'
import HeroSection from './hero/Herosection'
import AboutSection from './about/AboutSection'
import AboutItems from './about/newaboutpage/AboutItems'
import VideoSection from './videosection/VideoSection'
import EventSchedule from './eventSchedule/EventSchedule'
import Guest from './guest/Guest'
import AwardNomination from './award/AwardNomination'
import Gallery from './Gallery/Gallery'
import Shortfilm from './officialSection/Shortfilm'
import Documentaryfilm from './officialSection/Documentaryfilm'
import JurySection from './officialSection/jurySection'
import OfficialSection from './officialSection/OfficialSection'
import BlogsAndMedia from './blog&media/BlogsAndMedia'
import Footer from './footer/Footer'
import Contact from './contact/Contact'
import YearAward from './yearWiseAward/YearAward'
import Reveal from '@/components/common/Reveal'

export default function Home() {
  return (
    <>
   
      <div className="-mt-[10rem]" style={{ backgroundColor: '#ffffff' }}>
      <Reveal y={32}><HeroSection/></Reveal>
      <Reveal transition={{ type: 'tween', duration: 0.8, ease: [0.22, 1, 0.36, 1] }}><AboutSection/></Reveal>
      <Reveal y={32} delay={0.1}><VideoSection/></Reveal>
      <Reveal y={32} delay={0.15} transition={{ type: 'spring', stiffness: 140, damping: 16 }}><EventSchedule/></Reveal>
      <Reveal y={32} delay={0.15} transition={{ type: 'spring', stiffness: 140, damping: 16 }}><Guest/></Reveal>
      {/* <Reveal y={32} delay={0.15} transition={{ type: 'spring', stiffness: 140, damping: 16 }}><AwardNomination/></Reveal> */}
      <Reveal y={32} delay={0.32}><Shortfilm/></Reveal>
      <Reveal y={32} delay={0.33}><Documentaryfilm/></Reveal>
      <Reveal y={32} delay={0.3} transition={{ type: 'tween', duration: 1.1, ease: 'easeOut' }}><Gallery/></Reveal>
      <Reveal y={32} delay={0.34}><JurySection/></Reveal>
      <Reveal y={32} delay={0.35}><OfficialSection/></Reveal>
      <Reveal y={32} delay={0.36}><BlogsAndMedia/></Reveal>
      <Reveal y={32} delay={0.4}><Contact/></Reveal>
      <Reveal y={32} delay={0.45}><YearAward/></Reveal>
  
      </div>
    </>
  )
}
