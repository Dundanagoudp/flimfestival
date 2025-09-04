import React from "react";
import HeroSection from "./Hero/HeroSection";
import { Navbar } from "../Home/navbar/Navbar";
import AboutUsContent from "./AboutUsContent/AboutUsContent";
import ContentPage from "./ContentPage/ContentPage";

export default function AboutUs() {
    return (
    <>
    
     <div className="sticky top-0 z-50 w-full">
        <Navbar />
         <div className="-mt-[5rem]" style={{ backgroundColor: "#EEEEEE" }}>
        <HeroSection />
        <AboutUsContent />
        <ContentPage />
      
      </div>
      </div></>
    );
   
}