import React from "react";
import HeroEvent from "./module/HeroEvent";
import ViewEvent from "./module/ViewEvent";
import Footer from "../footer/Footer";
import { Navbar } from "../navbar/Navbar";

function Event() {
  return (
    <>
       <div className="sticky top-0 z-50 w-full">
              <Navbar />
            </div>
            <div className="-mt-[10rem]" style={{ backgroundColor: '#EEEEEE' }}>
      <HeroEvent />
      <ViewEvent />
      <Footer /></div>
    </>
  );
}

export default Event;
