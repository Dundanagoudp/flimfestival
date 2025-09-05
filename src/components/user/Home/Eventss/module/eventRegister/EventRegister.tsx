import React from 'react'
import { Navbar } from '../../../navbar/Navbar'
import HeroEvent from '../HeroEvent'
import Footer from '../../../footer/Footer'
import Eventpage from './module/page'

export default function EventRegister() {
  
  return (
    <>
      <div className="sticky top-0 z-50 w-full">
    <Navbar/></div>
    <div className="-mt-[10rem]" style={{ backgroundColor: '#EEEEEE' }}>
    <HeroEvent/>
    <Eventpage/>
    <Footer/></div>
    </>
  )
}
