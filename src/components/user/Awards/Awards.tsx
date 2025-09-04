import React from "react";
import { Navbar } from "../Home/navbar/Navbar";
import HeroSection from "./Hero/Herosection";
import AwardsPage from "./AwardsPage/AwardsPage";
import ContentPage from "./ContentPage/ContentPage";
import SubmitFormPage from "./SubmitFormPage/SubmitFormPage";

export const Awards = () => {
  return (
    <>
      <div className="sticky top-0 z-50 w-full">
        <Navbar />
      </div>
      <div className="-mt-[5rem]" style={{ backgroundColor: "#EEEEEE" }}>
      <HeroSection />
      <AwardsPage />
      <ContentPage />
      <SubmitFormPage />
      </div>
    </>
  );
};