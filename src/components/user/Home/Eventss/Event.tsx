import React from "react";
import HeroEvent from "./module/HeroEvent";
import ViewEvent from "./module/ViewEvent";
import Reveal from "@/components/common/Reveal";


function Event() {
  return (
    <>

            <div className="-mt-[10rem]" style={{ backgroundColor: '#EEEEEE' }}>
      <Reveal delay={0.1} y={-6} transition={{ type: 'spring', stiffness: 60, damping: 22, mass: 1.1 }}>
        <HeroEvent />
      </Reveal>
      <Reveal delay={0.2} y={-6} transition={{ type: 'spring', stiffness: 60, damping: 22, mass: 1.1 }}>
        <ViewEvent />
      </Reveal>
      </div>
    </>
  );
}

export default Event;
