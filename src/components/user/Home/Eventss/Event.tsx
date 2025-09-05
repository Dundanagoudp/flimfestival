import React from "react";
import HeroEvent from "./module/HeroEvent";
import ViewEvent from "./module/ViewEvent";


function Event() {
  return (
    <>

            <div className="-mt-[10rem]" style={{ backgroundColor: '#EEEEEE' }}>
      <HeroEvent />
      <ViewEvent />
      </div>
    </>
  );
}

export default Event;
