import React from "react";
import HeroSection from "./Hero/HeroSection";
import AboutUsContent from "./AboutUsContent/AboutUsContent";
import AboutItemsSection from "./AboutItemsSection/AboutItemsSection";
import Reveal from "@/components/common/Reveal";

export default function AboutUs() {
    return (
    <>
    

         <div className="-mt-[10rem]" style={{ backgroundColor: "#EEEEEE" }}>
          <Reveal delay={0.1} y={-10} transition={{ type: 'spring', stiffness: 90, damping: 18, mass: 0.8 }}>
            <HeroSection />
          </Reveal>
          <Reveal delay={0.2} y={-10} transition={{ type: 'spring', stiffness: 90, damping: 18, mass: 0.8 }}>
            <AboutUsContent />
          </Reveal>
          <Reveal delay={0.3} y={-10} transition={{ type: 'spring', stiffness: 90, damping: 18, mass: 0.8 }}>
            <AboutItemsSection />
          </Reveal>
      
      </div>
      </>
    );
   
}