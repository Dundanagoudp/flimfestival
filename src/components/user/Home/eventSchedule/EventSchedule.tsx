import React from "react";
import { Button } from "@/components/ui/button";





type ScheduleItemProps = {
  time: string
  title: string
  subtitle?: string
  active?: boolean
}

function Item({ time, title, subtitle, active }: ScheduleItemProps) {
  return (
    <article aria-current={active ? "true" : undefined} className="text-left">
      <p className="text-sm text-zinc-500">{time}</p>
      <h3 className="mt-1 text-lg font-semibold text-zinc-900">{title}</h3>
      {subtitle ? <p className="text-xs text-zinc-600">{`(${subtitle})`}</p> : null}
    </article>
  )
}

export default function EventSchedule() {
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
        aria-label="Event schedule for Day 1"
        className=" bg-white p-4 shadow-md border-t-10 border-r-10 border-b-10 border-[#343434] w-[95%] rounded-r-[10px]"
      >
        <div className=" p-6 md:p-8">
          <div className="">
            <div>
              {/* Left: Day + Date */}
              <header className="text-left">
                <h2 className="text-4xl font-bold">Day 1</h2>
                <p className="text-lg font-semibold">13th November 2024</p>
              </header></div>

            {/* Middle: Timeline + Items */}
            <div className="flex  justify-around items-center">
              {/* Timeline column */}
              <div className="">
                <div>
                  <ol className="mt-1 flex flex-col items-center gap-6 pt-1" >
                    <li>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary  font-semibold text-4xl">
                        1
                      </span>
                    </li>
                    <li>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-200 text-4xl font-semibold text-[#EEEEEE]">
                        2
                      </span>
                    </li>
                    <li>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-200 text-4xl font-semibold text-[#EEEEEE]">
                        3
                      </span>
                    </li>
                  </ol>
                </div>
              </div>

              {/* Items column */}
              <div className="">
                <div className="flex flex-col gap-8">
                  <Item time="09:30 AM Onwards" title="Inaugural Function" subtitle="Tagang Yaki Hall" active />
                  <Item time="09:30 AM Onwards" title="Inaugural Function" subtitle="Tagang Yaki Hall" />
                  <Item time="09:30 AM Onwards" title="Inaugural Function" subtitle="Tagang Yaki Hall" />
                </div>
              </div>

              {/* Image column */}
              <div className="w-[30%]">
               
                  <img
                    src="video.png"
                    alt="Event preview displayed on a production monitor inside the venue"
                    className="aspect-[4/3] w-full rounded-xl border border-zinc-200 object-cover shadow-sm"
                  />
                
              </div>
            </div>

          </div>
        </div>
      </section></>

  );
}
