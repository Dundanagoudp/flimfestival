"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { LoadingSpinner } from "@/components/common/LoaderSpinner";
import { getWorkshops } from "@/services/workshopService";
import { getLatestEvent } from "@/services/eventsService";

type ScheduleItemProps = {
  time: string;
  title: string;
  subtitle?: string;
  active?: boolean;
};

function Item({ time, title, subtitle, active }: ScheduleItemProps) {
  return (
    <article
      aria-current={active ? "true" : undefined}
      className="text-left min-h-[60px]"
    >
      <p className="text-sm text-zinc-500 min-h-[20px]">{time || " "}</p>
      <h3 className="mt-1 text-lg font-semibold text-zinc-900 min-h-[24px]">
        {title || " "}
      </h3>
      {subtitle && (
        <p className="text-xs text-zinc-600 min-h-[16px]">{`(${subtitle})`}</p>
      )}
    </article>
  );
}

export default function EventSchedule() {
  const [eventData, setEventData] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [workshopData, setWorkshopData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Effect to determine if the device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust the threshold as needed
    };

    // Initial check
    checkIfMobile();

    // Event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Get the event data directly from the response
  const currentEvent = eventData;

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const response = await getLatestEvent();
        setEventData(response);
        console.log(" Latest Event", response);
      } catch (err: any) {
        console.log(err);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    void fetchEvent();
  }, []);

  useEffect(() => {
    const fetchWorkshops = async () => {
      setLoading(true);
      try {
        const response = await getWorkshops();
        setWorkshopData(response);
        console.log("response of Workshop", response);
      } catch (err: any) {
        console.log(err);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    void fetchWorkshops();
  }, []);

  return (
    <>
      <div className="px-4 py-6 md:px-10 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[30%_70%]">
          <div></div>
          {/* Right side About content */}
          <div className="flex flex-col justify-center">
            <section className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Events Schedule</h2>
              <p className="text-xl md:text-3xl text-[#989898] leading-relaxed">
                We've been perfecting our steps for over 15 years to assure
                success for every single client we create for.
              </p>
              <div className="flex items-center gap-2">
                <Link href="/events">
                  <Button className="rounded-full bg-primary text-black hover:bg-yellow-300 hover:scale-105 hover:shadow-lg transition-all duration-200 ease-out text-sm md:text-base">
                    View Schedule
                  </Button>
                </Link>
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary animate-pulse hover:animate-bounce cursor-pointer">
                  <ArrowRight className="h-3 w-3 text-black" />
                </span>
              </div>
            </section>
          </div>
        </div>
      </div>
      <section
        aria-label={`Event schedule for ${currentEvent?.days?.[selectedDay]?.name}`}
        className="bg-white p-2 md:p-4 shadow-md border-t-10 border-r-10 border-b-10 border-[#343434] w-[95%] rounded-r-[10px] min-h-[400px] mx-auto"
      >
        <div className="p-4 md:p-8">
          <div className="">
            <div>
              {/* Left: Day + Date */}
              <header className="text-left">
                <h1 className="text-2xl md:text-4xl font-semibold text-h1rimary">
                  {currentEvent?.days?.[selectedDay]?.name ||
                    `Day ${selectedDay + 1}`}
                </h1>
                <h2 className="text-2xl md:text-4xl font-bold">
                  {currentEvent?.event?.name || "Event"}
                </h2>
                <p className="text-base md:text-lg font-semibold">
                  {currentEvent?.days?.[selectedDay]?.description ||
                    "No description available"}
                </p>
              </header>
            </div>
            {/* Middle: Timeline + Items */}
            <div className="flex flex-col md:flex-row justify-around items-center min-h-[300px]">
              {/* Timeline column */}
              <div className="flex-shrink-0 mb-4 md:mb-0">
                <div className="h-full flex items-center">
                  <ol className="flex flex-row md:flex-col items-center gap-4 md:gap-6">
                    {currentEvent?.days?.map((day: any, dayIndex: number) => (
                      <li key={day._id}>
                        <button
                          onClick={() => setSelectedDay(dayIndex)}
                          className={`flex h-9 w-9 items-center justify-center rounded-full font-semibold text-xl md:text-4xl transition-colors cursor-pointer ${
                            selectedDay === dayIndex
                              ? "bg-primary text-black hover:bg-yellow-300"
                              : "bg-zinc-200 text-[#EEEEEE] hover:bg-zinc-300"
                          }`}
                        >
                          {dayIndex + 1}
                        </button>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
              {/* Items column */}
              <div className="w-full md:flex-1 max-w-md md:max-w-none">
                <div className="h-72 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="flex flex-col gap-8 pr-4 items-center">
                      {currentEvent?.days?.[selectedDay]?.timeSlots?.length > 0
                        ? currentEvent.days[selectedDay].timeSlots.map(
                            (timeSlot: any, index: number) => (
                              <Item
                                key={timeSlot._id || index}
                                time={`${timeSlot.startTime} - ${timeSlot.endTime}`}
                                title={timeSlot.title}
                                subtitle={timeSlot.location}
                                active={index === 0}
                              />
                            )
                          )
                        : Array.from({ length: 3 }, (_, index) => (
                            <Item
                              key={`placeholder-${index}`}
                              time={index === 0 ? "00:00" : ""}
                              title={index === 0 ? "No Event scheduled" : ""}
                              subtitle=""
                              active={index === 0}
                            />
                          ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
              {/* Image column */}
              {!isMobile && (
                <div className="w-full md:w-[30%] flex-shrink-0 hidden md:block">
                  <div className="aspect-[4/3] w-full">
                    <img
                      src={
                        currentEvent?.days?.[selectedDay]?.image ||
                        currentEvent?.event?.image ||
                        "/fallback.png"
                      }
                      alt={
                        currentEvent?.days?.[selectedDay]?.description ||
                        "Event preview"
                      }
                      className="w-full h-full rounded-xl border border-zinc-200 object-cover shadow-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
