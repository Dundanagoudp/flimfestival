import React from "react";
import HeroSection from "./Herosection/HeroSection";
import ContactForm from "./ContactForm/ContactForm";
import { Navbar } from "../Home/navbar/Navbar";

export const ContactUs = () => {
  return (
    <>
     
      <div className="-mt-[10rem]" style={{ backgroundColor: "#EEEEEE" }}>
        <HeroSection />
        <ContactForm />
      </div>
    </>
  );
};
