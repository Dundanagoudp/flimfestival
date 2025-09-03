import React from "react";
import HeroSection from "./Herosection/HeroSection";
import ContactForm from "./ContactForm/ContactForm";
import { Navbar } from "../Home/navbar/Navbar";

export const ContactUs = () => {
  return (
    <>
      <div className="sticky top-0 z-50 w-full">
        <Navbar />
      </div>
      <div className="-mt-[5rem]" style={{ backgroundColor: "#EEEEEE" }}>
        <HeroSection />
        <ContactForm />
      </div>
    </>
  );
};
