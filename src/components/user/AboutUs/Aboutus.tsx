import React from "react";
import HeroSection from "./Hero/HeroSection";
import AboutUsContent from "./AboutUsContent/AboutUsContent";
import AboutPageSection from "./AboutPageSection/AboutPageSection";
import Reveal from "@/components/common/Reveal";

export default function AboutUs() {
    return (
    <>
    

         <div className="-mt-[10rem] bg-white">
          <Reveal delay={0.1} y={-10} transition={{ type: 'spring', stiffness: 90, damping: 18, mass: 0.8 }}>
            <HeroSection />
          </Reveal>
          <Reveal delay={0.2} y={-10} transition={{ type: 'spring', stiffness: 90, damping: 18, mass: 0.8 }}>
            <AboutPageSection />
          </Reveal>
          <Reveal delay={0.3} y={-10} transition={{ type: 'spring', stiffness: 90, damping: 18, mass: 0.8 }}>
            <AboutUsContent />
          </Reveal>
      </div>
      </>
    );
   
}