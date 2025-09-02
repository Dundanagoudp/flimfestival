
'use client'
import React,{useState,useEffect} from "react";
import { Button } from "@/components/ui/button";
export default function Gallery() {
     const items = [1, 2, 3, 4, 5, 6];
  const [index, setIndex] = useState(0);

      useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [items.length]);


  const visible = [
    items[index % items.length],
    items[(index + 1) % items.length],
    items[(index + 2) % items.length],
  ];
  return (
    <div>
      <main className="w-full px-4">
        <div className="px-10 py-10">
          <div>
            <div className="flex justify-center items-center flex-col">
              <h1 className="text-6xl font-black">Gallery</h1>

              <div className="flex items-center gap-2 mt-5">
                <Button className="rounded-full bg-primary text-black hover:bg-yellow-300">
                  View More
                </Button>
                <span
                  aria-hidden
                  className="inline-block h-4 w-4 rounded-full bg-primary"
                />
              </div>
            </div>

          </div>
        </div>
      </main>
      <div className="w-full flex gap-4 overflow-hidden rounded-[20px]">
      {visible.map((i) => (
        <div
          key={i}
          className="w-1/3  overflow-hidden shadow-sm"
        >
          <img
            src="video.png"
            alt={`video ${i}`}
            className="w-full h-full object-cover rounded-2xl"
            draggable="false"
          />
        </div>
      ))}
    </div>
    </div>
  );
}
