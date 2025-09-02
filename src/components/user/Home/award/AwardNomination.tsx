import { Button } from "@/components/ui/button";
import React from "react";

export default function AwardNomination() {
  return (
    <div>
      <main className="w-full px-4 " style={{ backgroundColor: "#ffffff" }}>
        <div className="px-10 py-10">
          <div className="space-y-10">
            <div className="flex justify-between">
              <div>
                <h1 className="text-lg font-bold text-primary">
                  Arunachal Film Festival
                </h1>
                <p className="text-4xl font-semibold">
                  Nomination for the best documentary film
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button className="rounded-full bg-primary text-black hover:bg-yellow-300">
                  View Schedule
                </Button>
                <span
                  aria-hidden
                  className="inline-block h-4 w-4 rounded-full bg-primary"
                />
              </div>
            </div>
            <div className=" px-4 py-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-full h-[277px] rounded-[10px] bg-gray-100 border border-gray-200 overflow-hidden shadow-sm"
                  >
                    <img
                      src="video.png"
                      alt={`video ${i}`}
                      className="w-full h-full object-cover"
                      draggable="false"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-10">
            <div className="flex justify-between">
              <div>
                <h1 className="text-lg font-bold text-primary">
                  Arunachal Film Festival
                </h1>
                <p className="text-4xl font-semibold">
                  Nomination for the best Short film
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button className="rounded-full bg-primary text-black hover:bg-yellow-300">
                  View Schedule
                </Button>
                <span
                  aria-hidden
                  className="inline-block h-4 w-4 rounded-full bg-primary"
                />
              </div>
            </div>
            <div className=" px-4 py-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-full h-[277px] rounded-[10px] bg-gray-100 border border-gray-200 overflow-hidden shadow-sm"
                  >
                    <img
                      src="video.png"
                      alt={`video ${i}`}
                      className="w-full h-full object-cover"
                      draggable="false"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
