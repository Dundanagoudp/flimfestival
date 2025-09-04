'use client'
import React ,{useEffect , useState} from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getTotalEvent } from "@/services/eventsService";




type ScheduleItemProps = {
  time: string
  title: string
  subtitle?: string
  active?: boolean
}

function Item({ time, title, subtitle, active }: ScheduleItemProps) {
  return (
    <article aria-current={active ? "true" : undefined} className="text-left min-h-[60px]">
      <p className="text-sm text-zinc-500 min-h-[20px]">{time || " "}</p>
      <h3 className="mt-1 text-lg font-semibold text-zinc-900 min-h-[24px]">{title || " "}</h3>
      {subtitle && <p className="text-xs text-zinc-600 min-h-[16px]">{`(${subtitle})`}</p>}
    </article>
  )
}

export default function EventSchedule() {
  const [eventData, setEventData] = useState<any>(null)
  const [selectedDay, setSelectedDay] = useState<number>(0)

  useEffect(() => {
const fetchEvent = async () => {
try{
const  response = await getTotalEvent();
setEventData(response)
console.log("response of Event", response)
}
catch(err:any){
  console.log(err)
}
}
  void fetchEvent()
  }, [])
  
  return (
    <>
      <div className="px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[30%_70%]  ">
          <div></div>

          {/* Right side About content */}
          <div className="flex flex-col justify-center">
            <section className="space-y-4">
              <h2 className="text-4xl font-bold ">Events Schedule</h2>
              <p className="text-3xl text-[#989898] leading-relaxed">
                We’ve been perfecting our steps for over 15 years to assure
                success for every single client we create for.
              </p>
              <div className="flex items-center gap-2">
                <Button className="rounded-full bg-primary text-black hover:bg-yellow-300">
                  View Schedule
                </Button>
                <span
                  aria-hidden
                  className="inline-block h-4 w-4 rounded-full bg-primary"
                />
              </div>
            </section>
          </div>
        </div>


      </div>
      <section
        aria-label={`Event schedule for ${eventData?.days?.[selectedDay]?.name || 'Day 1'}`}
        className="bg-white p-4 shadow-md border-t-10 border-r-10 border-b-10 border-[#343434] w-[95%] rounded-r-[10px] min-h-[400px]"
      >
        <div className=" p-6 md:p-8">
          <div className="">
            <div>
              {/* Left: Day + Date */}
              <header className="text-left">
              <h1 className="text-4xl font-semibold text-h1rimary">{eventData?.days?.[selectedDay]?.name || `Day ${selectedDay + 1}`}</h1>
                <h2 className="text-4xl font-bold">{eventData?.event.name || "Day 1"}</h2>
    
                <p className="text-lg font-semibold">{eventData?.days?.[selectedDay]?.description || "13th November 2024"}</p>
              </header>


            </div>

            {/* Middle: Timeline + Items */}
            <div className="flex justify-around items-center min-h-[300px]">
              {/* Timeline column */}
              <div className="flex-shrink-0">
                <div className="h-full flex items-center">
                  <ol className="flex flex-col items-center gap-6" >
                    {/* Always show 4 timeline items for consistency */}
                    {Array.from({ length: 4 }, (_, dayIndex) => (
                      <li key={dayIndex}>
                        <button
                          onClick={() => setSelectedDay(dayIndex)}
                          className={`flex h-9 w-9 items-center justify-center rounded-full font-semibold text-4xl transition-colors cursor-pointer ${
                            selectedDay === dayIndex
                              ? 'bg-primary text-black hover:bg-yellow-300'
                              : 'bg-zinc-200 text-[#EEEEEE] hover:bg-zinc-300'
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
              <div className="flex-1 max-w-md ">
                <div className="h-72 overflow-hidden ">
                  <ScrollArea className="h-full ">
                    <div className="flex flex-col gap-8 pr-4 items-center">
                      {eventData?.days?.[selectedDay]?.times?.length > 0 ? (
                        eventData.days[selectedDay].times.map((timeSlot: any, index: number) => (
                          <Item
                            key={timeSlot._id || index}
                            time={`${timeSlot.startTime} - ${timeSlot.endTime}`}
                            title={timeSlot.title}
                            subtitle={timeSlot.location}
                            active={index === 0}
                          />
                        ))
                      ) : (
                        // Show placeholder items to maintain consistent height
                        Array.from({ length: 3 }, (_, index) => (
                          <Item
                            key={`placeholder-${index}`}
                            time={index === 0 ? "Loading..." : ""}
                            title={index === 0 ? "Loading events..." : ""}
                            subtitle=""
                            active={index === 0}
                          />
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>

                            {/* Image column */}
              <div className="w-[30%] flex-shrink-0">
                <div className="aspect-[4/3] w-full">
                  <img
                    src={eventData?.days?.[selectedDay]?.image || "video.png"}
                    alt={eventData?.days?.[selectedDay]?.description || "Event preview displayed on a production monitor inside the venue"}
                    className="w-full h-full rounded-xl border border-zinc-200 object-cover shadow-sm"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      </>

  );
}
