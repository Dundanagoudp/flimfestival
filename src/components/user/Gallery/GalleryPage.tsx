import React from "react";
import HeroSection from "./Hero/HeroSection";
import { Navbar } from "../Home/navbar/Navbar";
import GalleryPage from "./GalleryPage/GalleryPage";

export default function GalleryPages() {
    return (
    <>
    
     <div className="sticky top-0 z-50 w-full">
        <Navbar />
         <div className="-mt-[5rem]" style={{ backgroundColor: "#EEEEEE" }}>
        <HeroSection />
        <GalleryPage />
      
      </div>
      </div></>
    );
   
}