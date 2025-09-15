'use client'
import React from "react";
import HeroEvent from "./module/HeroEvent";
import ViewEvent from "./module/ViewEvent";
import Reveal from "@/components/common/Reveal";


function ErrorFallback({error}: {error: Error}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-4">We're having trouble loading the events page.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-primary text-black px-6 py-2 rounded-full hover:bg-yellow-300"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

function Event() {
  return (

      <div className="-mt-[10rem]" style={{ backgroundColor: '#EEEEEE' }}>
        <Reveal delay={0.1} y={-6} transition={{ type: 'spring', stiffness: 60, damping: 22, mass: 1.1 }}>
          <HeroEvent />
        </Reveal>
        <Reveal delay={0.2} y={-6} transition={{ type: 'spring', stiffness: 60, damping: 22, mass: 1.1 }}>
          <ViewEvent />
        </Reveal>
      </div>

  );
}

export default Event;
