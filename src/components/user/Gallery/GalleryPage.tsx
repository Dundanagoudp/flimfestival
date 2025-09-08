import React from "react";
import HeroSection from "./Hero/HeroSection";
import { Navbar } from "../Home/navbar/Navbar";
import GalleryPage from "./GalleryPage/GalleryPage";
import Reveal from "@/components/common/Reveal";

export default function GalleryPages() {
    return (
    <>
    
 
         <div className="-mt-[10rem]" style={{ backgroundColor: "#EEEEEE" }}>
        <Reveal delay={0.1} y={-10} transition={{ type: 'spring', stiffness: 90, damping: 18, mass: 0.8 }}>
        <HeroSection />
        </Reveal>
        <Reveal delay={0.2} y={-10} transition={{ type: 'spring', stiffness: 90, damping: 18, mass: 0.8 }}>
        <GalleryPage />
        </Reveal>
      
      </div>
      </>
    );
   
}