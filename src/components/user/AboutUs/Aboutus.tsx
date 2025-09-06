import React from "react";
import HeroSection from "./Hero/HeroSection";
import { Navbar } from "../Home/navbar/Navbar";
import AboutUsContent from "./AboutUsContent/AboutUsContent";
import ContentPage from "./ContentPage/ContentPage";

export default function AboutUs() {
    return (
    <>
    

         <div className="-mt-[10rem]" style={{ backgroundColor: "#EEEEEE" }}>
        <HeroSection />
        <AboutUsContent />
        {/* <ContentPage /> */}
      
      </div>
      </>
    );
   
}